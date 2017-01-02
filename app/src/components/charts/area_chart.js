import React, { PropTypes } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

import ChartContainer from './chart_container';

const CustomizedAxisTick = ({ x, y, stroke, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={10} textAnchor="end" fill="#999" transform="rotate(-25)">
      {payload.value}
    </text>
  </g>
);

const AreaChartComponent = props => (
  <ChartContainer {...props} >
    <AreaChart
      data={props.data}
      margin={{ top: 0, right: 0, left: 0, bottom: 35 }}
    >
      <XAxis dataKey={props.xAxis} tick={<CustomizedAxisTick />} padding={props.padding} />
      <YAxis domain={props.domain} />
      <Tooltip itemStyle={{ color: '#0c1115' }} labelStyle={{ color: '#0c1115' }} />
      {props.lines.map((line, i) => <Area key={i} {...line} />)}
    </AreaChart>
  </ChartContainer>
);

AreaChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  padding: PropTypes.object,
  xAxis: PropTypes.string,
  domain: PropTypes.array,
  lines: PropTypes.array.isRequired,
};

export default AreaChartComponent;
