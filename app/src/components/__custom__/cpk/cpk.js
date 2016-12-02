import React, { PropTypes } from 'react';

const CpK = props => (
  <div>
    <h3>CpK 2</h3>
    <div>{props.message}</div>
  </div>
);

CpK.propTypes = {
  message: PropTypes.string,
};

export default CpK;
