import React from 'react';

import ChartContainer from './chart_container';

const AreaChartComponent = ({ lines, margin, data, domain, ticks, xAxis, padding }) =>(
  return (
    <ChartContainer>
      <AreaChart data={data} margin={margin}>
        <XAxis dataKey={xAxis} ticks={ticks} padding={padding} />
        <YAxis domain={domain} />
        <Tooltip />
        <Legend />
        {lines.map((line, i) => <Area key={i} {...line} />)}
      </AreaChart>
    </ChartContainer>
  );
}