import React from 'react';

const CustomizedAxisTick = ({ x, y, stroke, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={10} textAnchor="end" fill="#999" transform="rotate(-25)">
      {payload.value}
    </text>
  </g>
);

export default CustomizedAxisTick;
