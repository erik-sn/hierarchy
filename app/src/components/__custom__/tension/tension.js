/**
 * Module Created: 2016-12-06 08:56:00 -05:00
 * Author: NiehausE
 */
if (process.env.BROWSER) {
  require('./tension.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';

const Tension = props => (
  <div className="tension__container" >
    <h3>Hello tension</h3>
    <div>Parent: {props.parent.get('name')}</div>
  </div>
);

Tension.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default Tension;
