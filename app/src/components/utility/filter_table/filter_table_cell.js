import React, { Component, PropTypes } from 'react';

/**
 * Basic cell component for filter table
 * 
 * @param {string, string, string} { width, className, value }
 */
const Cell = ({ config, rowData, column, handleClick }) => {
  const cellClick = () => handleClick(rowData, column);
  return (
    <div
      onClick={cellClick}
      style={{ width: config.get('width') }}
      className={`filter_table__cell ${config.get('className') || ''}`.trim()}
    >
      <span>{rowData.get(config.get('label'))}</span>
    </div>
  );
};

Cell.propTypes = {
  config: PropTypes.object.isRequired,
  rowData: PropTypes.object.isRequired,
  column: PropTypes.number.isRequired,
  handleClick: PropTypes.func,
};

export default Cell;
