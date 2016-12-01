/**
 * Module Created: 2016-11-30 20:40:11 -05:00
 * Author: Erik
 */
if (process.env.BROWSER) {
  require('./extrusion_pack_analysis.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';

const ExtrusionPackAnalysis = props => (
  <div className="extrusion_pack_analysis__container" >
    <h3>Hello extrusion_pack_analysis</h3>
    <div>Parent: {props.item.get('name')}</div>
  </div>
);

ExtrusionPackAnalysis.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ExtrusionPackAnalysis;
