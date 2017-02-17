import * as React from 'react';
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts';

import { IDictionary } from '../../constants/interfaces';
import ChartContainer from './chart_container';
import CustomTick from './custom_tick';
import { IPadding } from './interfaces';

export interface IAreaChartProps {
  chartData: Array<IDictionary<number>>;
  padding?: IPadding;
  xAxis: string;
  domain?: number[];
  lines: any[];
  showImage?: boolean;
  showDownload?: boolean;
  fill?: string;
  download?: boolean;
  image?: boolean;
  imageTarget?: string;
}

const AreaChartComponent = (props: IAreaChartProps) => {
  const { chartData, xAxis, domain, lines, padding, imageTarget } = props;
  return (
    <ChartContainer {...props} >
      <AreaChart
        data={chartData}
        margin={{ top: 0, right: 0, left: 0, bottom: 35 }}
      >
        <XAxis dataKey={xAxis} tick={<CustomTick />} padding={padding} />
        <YAxis domain={domain} />
        <Tooltip itemStyle={{ color: '#0c1115' }} labelStyle={{ color: '#0c1115' }} />
        {lines.map((line, i) => <Area key={i} {...line} />)}
      </AreaChart>
    </ChartContainer>
  );
}

export default AreaChartComponent;
