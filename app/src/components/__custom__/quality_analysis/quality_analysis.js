/**
 * Module Created: 2016-12-04 10:25:32 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./quality_analysis.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';

const QualityAnalysis = props => (
  <div className="quality_analysis__container" >
    <h3>Hello quality_analysis</h3>
    <div>Parent: {props.parent.get('name')}</div>
  </div>
);

QualityAnalysis.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default QualityAnalysis;
