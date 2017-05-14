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
    dataKey: 'First Aid',
    fill: '#73BBD0',
    stroke: 'whitesmoke',
    isAnimationActive: true,
  },
  {
    strokeWidth: 1,
    type: 'linear',
    dot: false,
    dataKey: 'Near Misses',
    fill: '#D3B90A',
    stroke: 'whitesmoke',
    isAnimationActive: true,
  },
  {
    strokeWidth: 1,
    type: 'linear',
    dot: false,
    dataKey: 'Recordables',
    fill: '#EC3439',
    stroke: 'whitesmoke',
    isAnimationActive: true,
  },
];

class Safety extends React.Component<IProps, {}> {

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
      <div className="safety__container overview__chart">
        <h3>Annual Safety Data</h3>
        <BarChart
          xAxis="month"
          chartData={formattedData}
          bars={chartBars}
          showDownload
          showImage
        />
      </div>
    );
  }

  private monthSort(a: any, b: any) {
    return moment(a.month, 'MMM') > moment(b.month, 'MMM') ? 1 : -1;
  }

  private formatKeys(safetyData: Map<string, number>): {} {
    return {
      'First Aid': safetyData.get('first_aid'),
      'Near Misses': safetyData.get('near_misses'),
      'Recordables': safetyData.get('recordables'),
    };
  }

  private shouldComponentUpdate(nextProps: IProps): boolean {
    return !is(nextProps.plotData, this.props.plotData);
  }
}

export default Safety;
