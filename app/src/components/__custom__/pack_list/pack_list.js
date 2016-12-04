/**
 * Module Created: 2016-12-04 10:26:23 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./pack_list.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';

const PackList = props => (
  <div className="pack_list__container" >
    <h3>Hello pack_list</h3>
    <div>Parent: {props.parent.get('name')}</div>
  </div>
);

PackList.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default PackList;
