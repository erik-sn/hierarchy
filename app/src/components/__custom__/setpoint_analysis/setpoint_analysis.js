/**
 * Module Created: 2016-12-04 10:24:56 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./setpoint_analysis.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';

const SetpointAnalysis = props => (
  <div className="setpoint_analysis__container" >
    <h3>Hello setpoint_analysis</h3>
    <div>Parent: {props.parent.get('name')}</div>
  </div>
);

SetpointAnalysis.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default SetpointAnalysis;
