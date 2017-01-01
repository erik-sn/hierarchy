import React, { PropTypes } from 'react';

import Cell from './filter_table_cell';

/**
 * Generate a row of cells based on the rowData object
 * and the table configuration object.
 * 
 * @param {object} rowData - immutable Map
 * @param {object} rowMap - immutable List, table configuration
 * @returns {object} - immutable List of JSX.Elements
 */
function generateCells(rowData, rowMap) {
  return rowMap.map((cell, i) => (
    <Cell
      key={i}
      className={cell.get('childrenClass')}
      width={cell.get('width')}
      value={rowData.get(cell.get('label'))}
    />
  ));
}

/**
 * Container component to order a row of table cells
 *
 * @param {any} { className, rowData, rowMap }
 */
const Row = ({ className, rowData, rowMap }) => (
  <div className={`filter_table__row${className ? ` ${className}` : ''}`}>
    {generateCells(rowData, rowMap)}
  </div>
);

Row.propTypes = {
  rowMap: PropTypes.object.isRequired,
  className: PropTypes.string,
  rowData: PropTypes.object.isRequired,
};

export default Row;
