import * as React from 'react';
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import ChartContainer from './chart_container';
import CustomTick from './custom_tick';
import { IChartProps } from './interfaces';

const AreaChartComponent = (props: IChartProps) => (
  <ChartContainer {...props} >
    <LineChart
      data={props.chartData}
      margin={{ top: 0, right: 0, left: 0, bottom: 35 }}
    >
      <XAxis dataKey={props.xAxis} tick={<CustomTick />} padding={props.padding} />
      <YAxis domain={props.domain} />
      <Tooltip itemStyle={{ color: '#0c1115' }} labelStyle={{ color: '#0c1115' }} />
      {props.lines.map((line, i) => <Line key={i} {...line} />)}
    </LineChart>
  </ChartContainer>
);

export default AreaChartComponent;
