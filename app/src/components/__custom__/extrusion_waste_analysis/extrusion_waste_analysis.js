if (process.env.BROWSER) {
  require('./extrusion_waste_analysis.scss');  // eslint-disable-line global-require
}


import React, { Component, PropTypes } from 'react';

import ControlPanel from './control_panel';

class ExtrusionWasteAnalysis extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
    };
    this.updateData = this.updateData.bind(this);
  }

  updateData(data) {
    data.forEach(row => console.log(row));
    this.setState({ data });
  }

  render() {
    return (
      <div className="ewa__container">
        <div className="ewa__chart-container">
          chart goes here
        </div>
        <ControlPanel updateData={this.updateData} />
      </div>
    );
  }
}

ExtrusionWasteAnalysis.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default ExtrusionWasteAnalysis;