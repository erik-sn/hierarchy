/**
 * Module Created: 2017-05-13 13:29:24 -04:00
 * Author: erik
 */
import { List, Map } from 'immutable';
import * as React from 'react';

import { IBaseModule } from '../../../../src/constants/interfaces';
import AreaChart from '../../charts/area_chart';
import BarChart from '../../charts/bar_chart';
import Loader from '../../loader';

import { areaLine, bar } from '../chart_options';
import { sum } from '../stats';
import { getDateFromCreated, parseDateMap,
  parseTimeSeries, sortByDate } from '../utils';


const ForgeOverview = ({ departmentDataStore, type, parent }: IBaseModule) => {
  if (!departmentDataStore) {
    return <Loader />;
  }
  const units = departmentDataStore.get('procForgeUnit');
  const uptime = departmentDataStore.get('procForgeUptime');

  const uptimeData = parseTimeSeries(type, parent, uptime);

  const unitsWithDate = getDateFromCreated(units);
  let barChartData;
  if (type === 'machine') {
    barChartData = unitsWithDate.filter((obj) => obj.get('machine') === parent.id);
  } else {
    const dateMap = parseDateMap(type, parent, unitsWithDate);
    barChartData = dateMap.map((v, k) => Map({ date: k, value: sum(v) })).toList();
  }

  return (
    <div className="forge_overview__container" >
      <div className="forge__production">
        <h3>Forge Production</h3>
        <BarChart
          xAxis="date"
          chartData={barChartData.sort(sortByDate).toJS()}
          bars={[bar]}
          showDownload
          showImage
        />
      </div>
      <div className="forge__uptime">
        <h3>Forge Uptime</h3>
        <AreaChart
          xAxis="date"
          chartData={uptimeData.sort(sortByDate).toJS()}
          lines={[areaLine]}
          fill="#59A1B6"
          showDownload
          showImage
          imageTarget="forge__uptime"
        />
      </div>
    </div>
  );
};

export default ForgeOverview;
