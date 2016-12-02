import React, { Component } from 'react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, 
  XAxis, YAxis, Tooltip, Legend } from 'recharts';

import Csv from '../csv_generator';
import Png from './png_generator';

export default class LineChartComponent extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  getChart() {
    const { type, lines, margin, data, domain, ticks, xAxis, padding} = this.props;
    if (type === 'area') {
      return (
        <AreaChart data={data} margin={margin}>
          <XAxis dataKey={xAxis} ticks={ticks} padding={padding} />
          <YAxis domain={domain} />
          <Tooltip />
          <Legend />
          {lines.map((line, i) => <Area key={i} {...line} />)}
        </AreaChart>
      );
    }
  }

  render() {
    const { data, xAxis, download, image, type } = this.props;
    const params = [
      { header: 'X-Axis', label: xAxis },
      { header: 'Value', label: 'value' }
    ];

    return (
      <div className="chart__container" >
        <div className="chart__inner-container">
          <ResponsiveContainer>
            {this.props.children}
          </ResponsiveContainer>
        </div>
        <div className="chart__button-container">
          {download ?
            <Csv
              customClass="chart__button"
              customStyle={{ marginRight: '10px' }}
              label="Download Chart Data"
              data={data}
              fileName="processworkshop_data"
              params={params}
            />
            : undefined}
        {image ?
          <Png
            customClass="chart__button"
            label="Download Image"
            fileName="processworkshop_plot"
            target="recharts-surface"
          />
        : undefined}
        </div>
      </div>
    );
  }
}