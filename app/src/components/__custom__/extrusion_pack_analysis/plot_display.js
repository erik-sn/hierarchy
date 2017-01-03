import React, { PropTypes } from 'react';

import Loader from '../../loader';
import BarChart from '../../charts/bar_chart';

const PlotDisplay = ({ data }) => {
  if (!data) {
    return (
      <div className="pack_analysis__plot-display-container">
        <Loader style={{ height: '400px' }} size={75} thickness={5} />
      </div>
    );
  }
  if (data.size === 0) {
    return (
      <div className="pack_analysis__plot-display-container">
        <h3>No Data Returned</h3>
      </div>
    );
  }
  return (
    <div className="pack_analysis__plot-display-container">
      <BarChart
        xAxis="key"
        data={data.toJS()}
        bars={[{ strokeWidth: 1, type: 'linear', dot: false, dataKey: 'count', fill: '#73BBD0', stroke: 'whitesmoke', isAnimationActive: false }]}
        fill="#59A1B6"
        download
        image
      />
    </div>
  );
};

PlotDisplay.propTypes = {
  data: PropTypes.object,
};

export default PlotDisplay;
