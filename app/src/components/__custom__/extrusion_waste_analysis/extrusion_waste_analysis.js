if (process.env.BROWSER) {
  require('./extrusion_waste_analysis.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';

const ExtrusionWasteAnalysis = props => (
  <div className="extrusion_waste_analysis__container" >
    <h3>Hello extrusion_waste_analysis</h3>
    <div>Parent: {props.parent.get('name')}</div>
  </div>
);

ExtrusionWasteAnalysis.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default ExtrusionWasteAnalysis;
