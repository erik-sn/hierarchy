import * as  React from 'react';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';

import ChartContainer from './chart_container';
import CustomTick from './custom_tick';
import { IChartProps } from './interfaces';

interface IBarChartProps extends IChartProps {
  fill?: string;
}

const BarChartComponent = (props: IBarChartProps) => (
  <ChartContainer {...props} >
    <BarChart
      data={props.chartData}
      margin={{ top: 0, right: 0, left: 0, bottom: 35 }}
    >
      <XAxis dataKey={props.xAxis} tick={<CustomTick />} padding={props.padding} />
      <YAxis domain={props.domain} />
      <Tooltip itemStyle={{ color: '#0c1115' }} labelStyle={{ color: '#0c1115' }} />
      {props.bars.map((bar, i) => <Bar key={i} {...bar} />)}
    </BarChart>
  </ChartContainer>
);


export default BarChartComponent;
