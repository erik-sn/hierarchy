import React, { PropTypes } from 'react';

/**
 * Basic cell component for filter table
 * 
 * @param {string, string, string} { width, className, value }
 */
const Cell = ({ width, value, className, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      style={{ width }}
      className={`filter_table__cell${className ? ` ${className}` : ''}`}
    >
      <span>{value}</span>
    </div>
  );
};

Cell.propTypes = {
  className: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  value: PropTypes.string,
  handleClick: PropTypes.func,
};

export default Cell;
