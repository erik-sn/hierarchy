import React, { PropTypes } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';

import ChartContainer from './chart_container';
import CustomTick from './custom_tick';

const data01 = [{ date: '1', x: 1, y: 30 }, { date: '2', x: 2, y: 200 }];


const ScatterChartComponent = props => (
  <ChartContainer {...props} >
    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <XAxis dataKey={props.xAxis} />
      <YAxis dataKey={props.yAxis} />
      <Tooltip itemStyle={{ color: '#0c1115' }} labelStyle={{ color: '#0c1115' }} />
      <Scatter data={props.data} fill={props.fill || '#0c1115'} />
    </ScatterChart>
  </ChartContainer>
);

/**
    <ScatterChart
      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
    >
      <XAxis dataKey={props.xAxis} tick={<CustomTick />} padding={props.padding} />
      <YAxis dataKey={props.yAxis} domain={props.domain} />
      <Scatter xAxisId={props.xAxis} yAxisId={props.yAxis} data={props.data} fill={props.fill || '#0c1115'} />
      <Tooltip itemStyle={{ color: '#0c1115' }} labelStyle={{ color: '#0c1115' }} />
    </ScatterChart>
*/

ScatterChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
  padding: PropTypes.object,
  xAxis: PropTypes.string.isRequired,
  yAxis: PropTypes.string.isRequired,
  fill: PropTypes.string,
  domain: PropTypes.array,
};

export default ScatterChartComponent;
