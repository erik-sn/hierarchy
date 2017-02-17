import * as React from 'react';
import { Cell, Pie, PieChart, Sector } from 'recharts';

import { IChartProps } from './interfaces';


const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name.toUpperCase()}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{value}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

export interface IPieChartProps extends IChartProps {
  handleClick?: (entry: any) => void;
}

export interface IPieChartState {
  activeIndex: number;
  activeShape: JSX.Element;
  label: string;
}

class TwoLevelPieChart extends React.Component<IPieChartProps, IPieChartState> {

  constructor(props: IPieChartProps) {
    super(props);
    this.state = {
      activeIndex: 0,
      activeShape: undefined,
      label: undefined,
    };
    this.onPieEnter = this.onPieEnter.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  public onPieEnter(input: any, index: number) {
    this.setState({
      activeIndex: index,
    });
  }

  public handleClick(entry: any) {
    if (this.props.handleClick) {
      this.props.handleClick(entry);
    }
  }

  public render() {
    const { activeIndex } = this.state;
    const { chartData } = this.props;
    return (
      <div>
        <PieChart width={400} height={300} onMouseEnter={this.onPieEnter}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={chartData}
            cx={200}
            cy={200}
            innerRadius={50}
            outerRadius={70}
            onClick={this.handleClick}
          >
            {chartData.map((entry, i) => <Cell key={i} fill={entry['color'] || '#59A1B6'} />)}
          </Pie>
        </PieChart>
      </div>
    );
  }
}

export default TwoLevelPieChart;
