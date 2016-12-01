import React, { PropTypes } from 'react';

const Production = props => (
  <div>
    <h3>{props.module.get('label')}</h3>
  </div>
);

Production.propTypes = {
  module: PropTypes.object.isRequired,
};

export default Production;
