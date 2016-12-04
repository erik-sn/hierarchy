/**
 * Module Created: 2016-12-04 10:25:41 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./processlog.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';

const Processlog = props => (
  <div className="processlog__container" >
    <h3>Hello processlog</h3>
    <div>Parent: {props.parent.get('name')}</div>
  </div>
);

Processlog.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default Processlog;
