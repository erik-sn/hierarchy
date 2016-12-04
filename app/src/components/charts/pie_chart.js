import React, { Component, PropTypes } from 'react';
import { PieChart, Pie, Sector } from 'recharts';

const renderActiveShape = (props) => {
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


class TwoLevelPieChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: undefined,
      activeShape: undefined,
      label: undefined,
    };
    this.onPieEnter = this.onPieEnter.bind(this);
  }

  onPieEnter(input, index) {
    this.setState({
      activeIndex: index,
    });
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <div>
        <PieChart width={400} height={400} onMouseEnter={this.onPieEnter}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={this.props.data}
            cx={200}
            cy={200}
            innerRadius={55}
            outerRadius={80}
            fill="#59A1B6"
          />
        </PieChart>
      </div>
    );
  }
}

TwoLevelPieChart.propTypes = {
  data: PropTypes.array,
};

export default TwoLevelPieChart;
