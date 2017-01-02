import React, { PropTypes } from 'react';

/**
 * Basic cell component for filter table
 * 
 * @param {string, string, string} { width, className, value }
 */
const Cell = ({ width, className, value }) => (
  <div
    style={{ width }}
    className={`filter_table__cell ${className || ''}`.trim()}
  >
    <span>{value}</span>
  </div>
);

Cell.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};

export default Cell;
