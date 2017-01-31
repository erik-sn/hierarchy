import * as React from 'react';

interface IPayload {
  value: string;
}

export interface ICustomTickProps {
  x?: string;
  y?: string;
  stroke?: string;
  payload?: IPayload;
}

const CustomizedAxisTick = ({ x, y, stroke, payload }: ICustomTickProps) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={10} textAnchor="end" fill="#999" transform="rotate(-25)">
      {payload.value}
    </text>
  </g>
);

export default CustomizedAxisTick;
