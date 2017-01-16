import React, { PropTypes } from 'react';
import moment from 'moment';
import { List, Map } from 'immutable';

import Loader from '../../loader';
import LineChart from '../../charts/line_chart';
import { getDateSort } from '../../../utils/sort';

function checkForDateGaps(subgroupData) {
  return subgroupData.reduce((subgroupList, subgroup, i) => {
    if (i > 0) {
      const previousSubgroup = subgroupList.get(i - 1);
      const previousDate = moment(previousSubgroup.get('date'), 'MM/DD/YY');
      const currentDate = moment(subgroup.get('date'), 'MM/DD/YY');
      const daysDifferent = Math.floor(currentDate.diff(previousDate) / (1000 * 60 * 60 * 24));
      if (daysDifferent > 3) {
        const nullDate = Map({ date: currentDate.subtract(1, 'days').format('MM/DD/YY') });
        return subgroupList.push(nullDate).push(subgroup);
      }
    }
    return subgroupList.push(subgroup);
  }, List([]));
}

function reduceSubgroup(groupedData, subgroup) {
  const date = subgroup.get('subgroupDate');
  const value = subgroup.get('value');
  if (groupedData.has(date)) {
    return groupedData.set(date, groupedData.get(date).push(value));
  }
  return groupedData.set(date, List([value]));
}

function formatDateMap(subgroup) {
  const subgroupDate = moment(subgroup.get('createDate'), 'YYYY-MM-DDTHH:mm:ss');
  return subgroup.set('subgroupDate', subgroupDate.format('MM/DD/YY'));
}

function processTestData(testData, limit) {
  return testData.filter(subgroup => (
    // check to make sure this product has a limit attached to it
    !limit || subgroup.get('test') === limit.get('test')
  )).map(formatDateMap).reduce(reduceSubgroup, Map({}));
}

function averageData(subgroupData) {
  return List(subgroupData.keys()).map((key) => {
    const subgroupValues = subgroupData.get(key);
    const sumFunction = (total, value) => total + value;
    const average = subgroupValues.reduce(sumFunction, 0) / subgroupValues.size;
    return Map({ date: key, value: (average).toFixed(2) });
  });
}

function getDataRange(subgroupData) {
  const values = subgroupData.filter(datapoint => datapoint.get('value'))
  .map((datapoint) => {
    const value = datapoint.get('value');
    if (typeof value === 'string') {
      return Number(value);
    }
    return value;
  }).toJS();
  const minRange = Math.min.apply(null, values);
  const maxRange = Math.max.apply(null, values);
  return { minRange, maxRange };
}

function getLimits(limit, minRange, maxRange) {
  const { lrl, lcl, ucl, url } = limit.toJS();
  let low = lrl || lcl || minRange;
  low = minRange < low ? minRange : low;
  let high = url || ucl || maxRange;
  high = maxRange > high ? maxRange : high;
  return { high, low };
}

function getDomain(limit, subgroupData) {
  const { minRange, maxRange } = getDataRange(subgroupData);
  if (!limit) {
    return [minRange * 0.95, maxRange * 1.05];
  }
  let { high, low } = getLimits(limit, minRange, maxRange);
  const range = (high - low) / 4;
  if (high - low > 1) {
    low = Math.floor(low - range);
    high = Math.ceil(high + range);
  } else {
    low -= range;
    high += range;
  }
  return [low, high];
}

const CONTROL_CHART_LINES = [
  { strokeWidth: 2, type: 'linear', dot: false, dataKey: 'url', fill: 'red', stroke: 'red', isAnimationActive: false },
  { strokeWidth: 2, strokeDasharray: '5 5', type: 'linear', dot: false, dataKey: 'ucl', fill: 'yellow', stroke: 'yellow', isAnimationActive: false },
  { strokeWidth: 2, type: 'linear', dot: false, dataKey: 'target', fill: 'black', stroke: 'black', isAnimationActive: false },
  { strokeWidth: 2, type: 'linear', dot: false, dataKey: 'value', fill: 'blue', stroke: 'blue', isAnimationActive: false },
  { strokeWidth: 2, strokeDasharray: '5 5', type: 'linear', dot: false, dataKey: 'lcl', fill: 'yellow', stroke: 'yellow', isAnimationActive: false },
  { strokeWidth: 2, type: 'linear', dot: false, dataKey: 'lrl', fill: 'red', stroke: 'red', isAnimationActive: false },
];

const ControlChart = ({ fetchingTestData, testData, limit }) => {
  if (fetchingTestData) {
    return <Loader color="black" />;
  }
  if (!fetchingTestData && !testData) {
    return <div className="quality_analysis__prompt">Select a Test</div>;
  }
  const processedData = processTestData(testData, limit);
  let lineChartData = averageData(processedData).sort(getDateSort('date'));
  if (limit) {
    const { lrl, lcl, target, ucl, url } = limit.toJS();
    lineChartData = lineChartData.map(sg => (
      sg.set('target', target).set('url', url).set('ucl', ucl).set('lcl', lcl).set('lrl', lrl)
    ));
  }
  lineChartData = checkForDateGaps(lineChartData);
  return (
    <div className="quality_analysis__control-chart-container">
      <LineChart
        xAxis="date"
        data={lineChartData.toJS()}
        domain={getDomain(limit, lineChartData)}
        lines={CONTROL_CHART_LINES}
        download
        image
      />
    </div>
  );
};

ControlChart.propTypes = {
  fetchingTestData: PropTypes.bool.isRequired,
  limit: PropTypes.object,
  testData: PropTypes.object,
};

export default ControlChart;
