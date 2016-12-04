import React, { Component, PropTypes } from 'react';
import { ResponsiveContainer } from 'recharts';

import Csv from '../csv_generator';
import Png from '../png_generator';

class ChartContainer extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {
    const { data, xAxis, download, image, children } = this.props;
    const params = [
      { header: 'X-Axis', label: xAxis },
      { header: 'Value', label: 'value' },
    ];

    return (
      <div className="chart__container" >
        <ResponsiveContainer>
          {children}
        </ResponsiveContainer>
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

ChartContainer.propTypes = {
  data: PropTypes.array.isRequired,
  xAxis: PropTypes.string.isRequired,
  download: PropTypes.bool,
  image: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ChartContainer;

