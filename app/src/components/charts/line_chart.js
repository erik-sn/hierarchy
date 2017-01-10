import React, { PropTypes } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import ChartContainer from './chart_container';
import CustomTick from './custom_tick';

const AreaChartComponent = props => (
  <ChartContainer {...props} >
    <LineChart
      data={props.data}
      margin={{ top: 0, right: 0, left: 0, bottom: 35 }}
    >
      <XAxis dataKey={props.xAxis} tick={<CustomTick />} padding={props.padding} />
      <YAxis domain={props.domain} />
      <Tooltip itemStyle={{ color: '#0c1115' }} labelStyle={{ color: '#0c1115' }} />
      {props.lines.map((line, i) => <Line key={i} {...line} />)}
    </LineChart>
  </ChartContainer>
);

AreaChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
  padding: PropTypes.object,
  xAxis: PropTypes.string,
  domain: PropTypes.array,
  lines: PropTypes.array.isRequired,
};

export default AreaChartComponent;
