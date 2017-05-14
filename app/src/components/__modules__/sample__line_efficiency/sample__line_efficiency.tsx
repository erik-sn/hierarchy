
import { List, Map } from 'immutable';
import * as moment from 'moment';
import * as React from 'react';

import { IBaseModule, IDepartment, IMachine } from '../../../../src/constants/interfaces';
import AreaChart from '../../charts/area_chart';
import Loader from '../../loader';
import { areaLine } from '../chart_options';
import { average, computeStats, IInput, sum } from '../stats';
import { parseTimeSeries } from '../utils';



const SampleLineEfficiency = ({ parent, type, departmentDataStore }: IBaseModule) => {
  if (!departmentDataStore) {
    return <Loader />;
  }
  const rawEfficiency = departmentDataStore.get('procEfficiency');
  const efficiency = parseTimeSeries(type, parent, rawEfficiency);
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
          lines={[areaLine]}
          fill="#59A1B6"
          showDownload
          showImage
          imageTarget="sample__line_efficiency-chart"
        />
      </div>
    </div>
  );
};

export default SampleLineEfficiency;
