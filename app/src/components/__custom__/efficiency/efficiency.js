import React, { PropTypes } from 'react';

const Efficiency = props => (
  <div>
    <h3>efficiency</h3>
    <div>{props.message}</div>
  </div>
);

Efficiency.propTypes = {
  message: PropTypes.string,
};

export default Efficiency;
