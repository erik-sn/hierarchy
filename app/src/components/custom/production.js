import React, { PropTypes } from 'react';

const Production = props => (
  <div>
    <h3>{props.module.get('label')}</h3>
    <div>{props.data}</div>
  </div>
);

Production.propTypes = {
  data: PropTypes.object.isRequired,
  module: PropTypes.object.isRequired,
};

export default Production;
