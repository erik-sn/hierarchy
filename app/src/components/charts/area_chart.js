import React, { PropTypes } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import ChartContainer from './chart_container';


const AreaChartComponent = props => (
  <ChartContainer {...props} >
    <AreaChart
      data={props.data}
      margin={props.margin}
    >
      <XAxis dataKey={props.xAxis} ticks={props.ticks} padding={props.padding} />
      <YAxis domain={props.domain} />
      <Tooltip />
      {props.lines.map((line, i) => <Area key={i} {...line} />)}
    </AreaChart>
  </ChartContainer>
);


AreaChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
  margin: PropTypes.object,
  padding: PropTypes.object,
  xAxis: PropTypes.string,
  ticks: PropTypes.object,
  domain: PropTypes.array,
  lines: PropTypes.array.isRequired,
};

export default AreaChartComponent;
