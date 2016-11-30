import React, { PropTypes } from 'react';

const CpK = props => (
  <div>
    <h3>CpK</h3>
    <div>{props.message}</div>
  </div>
);

CpK.propTypes = {
  message: PropTypes.string,
};

export default CpK;
