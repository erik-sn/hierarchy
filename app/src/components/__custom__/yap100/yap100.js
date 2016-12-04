/**
 * Module Created: 2016-12-04 10:25:49 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./yap100.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';

const Yap100 = props => (
  <div className="yap100__container" >
    <h3>Hello yap100</h3>
    <div>Parent: {props.parent.get('name')}</div>
  </div>
);

Yap100.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default Yap100;
