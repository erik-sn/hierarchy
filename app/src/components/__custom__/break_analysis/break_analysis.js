/**
 * Module Created: 2016-12-03 13:39:04 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./break_analysis.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';

const BreakAnalysis = props => (
  <div className="break_analysis__container" >
    <h3>Hello break_analysis</h3>
    <div>Parent: {props.parent.get('name')}</div>
  </div>
);

BreakAnalysis.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default BreakAnalysis;
