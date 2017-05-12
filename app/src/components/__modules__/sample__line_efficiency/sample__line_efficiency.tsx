import * as moment from 'moment';
import * as React from 'react';
import { List, Map } from 'immutable';

import { IHierarchyTier, IBaseModule } from '../../../../src/constants/interfaces';
import { average, computeStats, IInput, sum } from "../stats";
import AreaChart from '../../charts/area_chart';

export interface IProps extends IBaseModule {
}

// for efficiency plot
const line: any = {
  strokeWidth: 2,
  type: 'linear',
  dot: false,
  dataKey: 'value',
  fill: '#73BBD0',
  stroke: 'whitesmoke',
  isAnimationActive: true,
};


const SampleLineEfficiency = ({ parent, type, departmentDataStore }: IProps) => {
  if (!departmentDataStore) {
    return <div>Loading</div>;
  }

  let efficiency = departmentDataStore.get('procEfficiency').map((e) => (
    e.set('date', moment(e.get('created')).format('HH:mm'))
  ));

  if (type === 'machine') {
    efficiency = efficiency.filter(obj => obj.get('machine') === parent.id);
  } else {
    const dateMap = efficiency.reduce((map, cur) => {
      const date = cur.get('date');
      if (map.has(date)) {
        return map.set(date, map.get(date).push(cur.get('value')));
      } else {
        return map.set(date, List([cur.get('value')]));
      }
    }, Map<string, List<any>>());
    efficiency = dateMap.map((v, k) => Map({ date: k, value: average(v) })).toList()
    console.log(efficiency.toJS());
  }

  const { count, avg, stdev } = computeStats(efficiency, 'value');
  return (
    <div className="sample__line_efficiency__container" >
      <div className="sample__line_efficiency-stats">
        <div>Count: <span>{count}</span></div>
        <div>Average: <span>{avg.toFixed(2)}%</span></div>
        <div>Standard Deviation: <span>{stdev.toFixed(2)}%</span></div>
      </div>
      <div className="sample__line_efficiency-chart">
        <AreaChart
          xAxis="date"
          chartData={efficiency.toJS()}
          lines={[line]}
          fill="#59A1B6"
          showDownload
          showImage
          imageTarget="sample__line_efficiency-chart"
        />
      </div>
    </div>
  );
}

export default SampleLineEfficiency;
