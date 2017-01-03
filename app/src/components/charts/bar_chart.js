import React, { PropTypes } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

import CustomTick from './custom_tick';
import ChartContainer from './chart_container';

const BarChartComponent = props => (
  <ChartContainer {...props} >
    <BarChart
      data={props.data}
      margin={{ top: 0, right: 0, left: 0, bottom: 35 }}
    >
      <XAxis dataKey={props.xAxis} tick={<CustomTick />} padding={props.padding} />
      <YAxis domain={props.domain} />
      <Tooltip itemStyle={{ color: '#0c1115' }} labelStyle={{ color: '#0c1115' }} />
      {props.bars.map((bar, i) => <Bar key={i} {...bar} />)}
    </BarChart>
  </ChartContainer>
);

BarChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
  padding: PropTypes.object,
  xAxis: PropTypes.string,
  domain: PropTypes.array,
  bars: PropTypes.array.isRequired,
};

export default BarChartComponent;
