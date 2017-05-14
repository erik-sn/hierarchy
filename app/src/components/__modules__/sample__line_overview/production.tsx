import { is, List, Map } from 'immutable';
import * as moment from 'moment';
import * as React from 'react';

import BarChart from '../../charts/bar_chart';
import Loader from '../../loader';

interface IProps {
  production: List<Map<string, any>>;
  scrap: List<Map<string, any>>;
}

const chartBars = [
  {
    strokeWidth: 1,
    type: 'linear',
    dot: false,
    dataKey: 'Production Pounds',
    fill: '#73BBD0',
    stroke: 'whitesmoke',
    isAnimationActive: true,
  },
];

class Waste extends React.Component<IProps, {}> {

  public render(): JSX.Element {
    const { production, scrap } = this.props;
    if (!production || !scrap) {
      return <Loader />;
    }

    const productionMap = this.sumByProduct(production);
    const scrapMap = this.sumByProduct(scrap);
    const wasteMap = scrapMap
                      .mergeWith(this.mergeScrapWithProduction, productionMap)
                      .map((v, k) => ({ 'Product': k, 'Percent Waste': v.toFixed(1)}))
                      .toList()
                      .toJS()
                      .sort(this.sortWasteForPareto);

    return (
      <div className="waste_container overview__chart">
        <h3>Waste Percent By Product</h3>
        <BarChart
          xAxis="Product"
          chartData={wasteMap}
          bars={chartBars}
          domain={[0, 8]}
          showDownload
          showImage
        />
      </div>
    );
  }

  private mergeScrapWithProduction(scrap: number, production: number): number {
    return 100 * scrap / production;
  }

  private sortWasteForPareto(a: any, b: any): number {
    return parseFloat(a['Percent Waste']) < parseFloat(b['Percent Waste']) ? 1 : -1;
  }

  private sumByProduct(production: List<Map<string, any>>): Map<string, number> {
    return production.reduce((map, cur) => {
      const product = cur.get('keyword');
      if (map.has(product)) {
        return map.set(product, map.get(product) + cur.get('value'));
      } else {
        return map.set(product, cur.get('value'));
      }
    }, Map<string, number>());
  }

  private shouldComponentUpdate(nextProps: IProps): boolean {
    return !is(nextProps.production, this.props.production) ||
           !is(nextProps.scrap, this.props.scrap);
  }
}

export default Waste;
