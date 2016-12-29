import React, { PropTypes } from 'react';

const Cell = ({ width, className, value }) => (
  <div
    style={{ width }}
    className={`filter_table__cell${className ? ` ${className}` : ''}`}
  >
    {value}
  </div>
);

Cell.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};

export default Cell;
