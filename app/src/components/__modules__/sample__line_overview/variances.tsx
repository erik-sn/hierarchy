import { is, Map } from 'immutable';
import * as moment from 'moment';
import * as React from 'react';

import BarChart from '../../charts/bar_chart';
import Loader from '../../loader';

interface IProps {
  plotData: Map<string, any>;
}

const chartBars = [
  {
    strokeWidth: 1,
    type: 'linear',
    dot: false,
    dataKey: 'Total',
    fill: '#73BBD0',
    stroke: 'whitesmoke',
    isAnimationActive: true,
  },
  {
    strokeWidth: 1,
    type: 'linear',
    dot: false,
    dataKey: 'MRO',
    fill: '#D3B90A',
    stroke: 'whitesmoke',
    isAnimationActive: true,
  },
  {
    strokeWidth: 1,
    type: 'linear',
    dot: false,
    dataKey: 'Labor',
    fill: '#EC3439',
    stroke: 'whitesmoke',
    isAnimationActive: true,
  },
  {
    strokeWidth: 1,
    type: 'linear',
    dot: false,
    dataKey: 'Utilities',
    fill: '#0D4D4D',
    stroke: 'whitesmoke',
    isAnimationActive: true,
  },
];

class Variances extends React.Component<IProps, {}> {

  public render(): JSX.Element {
    const { plotData } = this.props;
    if (!plotData) {
      return <Loader />;
    }

    const formattedData = plotData.map((v: Map<string, number>, k) => {
      return {
        month: k[0].toUpperCase() + k.slice(1),
        ...this.formatKeys(v)};
    })
    .toList()
    .toJS()
    .sort(this.monthSort);

    return (
      <div className="variance__container overview__chart">
        <h3>Annual Variance Data</h3>
        <BarChart
          xAxis="month"
          chartData={formattedData}
          bars={chartBars}
          showDownload
          showImage
          domain={[-5000, 5000]}
        />
      </div>
    );
  }

  private monthSort(a: any, b: any) {
    return moment(a.month, 'MMM') > moment(b.month, 'MMM') ? 1 : -1;
  }

  private formatKeys(plotData: Map<string, number>): {} {
    return {
      MRO: plotData.get('mro'),
      Labor: plotData.get('labor'),
      Utilities: plotData.get('utilities'),
      Total: plotData.get('mro') + plotData.get('labor') + plotData.get('utilities'),
    };
  }

  private shouldComponentUpdate(nextProps: IProps): boolean {
    return !is(nextProps.plotData, this.props.plotData);
  }
}

export default Variances;
