import { is, List, Map } from 'immutable';
import * as moment from 'moment';
import * as React from 'react';

import { IMachine } from '../../../constants/interfaces';
import BarChart from '../../charts/bar_chart';
import Loader from '../../loader';

interface IProps {
  production: List<Map<string, any>>;
  scrap: List<Map<string, any>>;
  machines: IMachine[];
}

const chartBars = [
  {
    strokeWidth: 1,
    type: 'linear',
    dot: false,
    dataKey: 'Percent Waste',
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

    const productionByProduct = this.sumByProduct(production);
    const scrapByProduct = this.sumByProduct(scrap);
    const wasteByProduct = this.formatDataMap(scrapByProduct, productionByProduct, 'Product');

    const productionByMachine = this.sumByMachine(production);
    const scrapByMachine = this.sumByMachine(scrap);
    const wasteByMachine = this.formatDataMap(scrapByMachine, productionByMachine, 'Machine');

    return (
      <div className="overview__middle overview__pair">
        <div className="waste_container overview__chart">
          <h3>Waste Percent By Product</h3>
          <BarChart
            xAxis="Product"
            chartData={wasteByProduct}
            bars={chartBars}
            domain={[0, 12]}
            showDownload
            showImage
          />
        </div>
        <div className="waste_container overview__chart">
          <h3>Waste Percent By Machine</h3>
          <BarChart
            xAxis="Machine"
            chartData={wasteByMachine}
            bars={chartBars}
            domain={[0, 12]}
            showDownload
            showImage
          />
        </div>
      </div>
    );
  }

  private formatDataMap(scrap: Map<string, number>, production: Map<string, number>, xaxis: string): any[] {
    return scrap.mergeWith(this.mergeScrapWithProduction, production)
            .map((v, k) => ({ [xaxis]: k, 'Percent Waste': v.toFixed(1)}))
            .toList()
            .toJS()
            .sort(this.sortWasteForPareto);
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

  private sumByMachine(production: List<Map<string, any>>): Map<string, number> {
    const { machines } = this.props;
    return production.reduce((map, cur) => {
      const machineId = cur.get('machine');
      const machineName = machines.find((m) => m.id === machineId).name;
      if (map.has(machineName)) {
        return map.set(machineName, map.get(machineName) + cur.get('value'));
      } else {
        return map.set(machineName, cur.get('value'));
      }
    }, Map<string, number>());
  }

  private shouldComponentUpdate(nextProps: IProps): boolean {
    return !is(nextProps.production, this.props.production) ||
           !is(nextProps.scrap, this.props.scrap);
  }
}

export default Waste;
