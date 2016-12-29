import React, { PropTypes } from 'react';

import Cell from './filter_table_cell';

function generateCells(rowData, rowMap) {
  return rowMap.map((cell, i) => (
    <Cell
      key={i}
      className={rowData.get('classNames') ? rowData.get('classNames').get(cell.label) : ''}
      width={cell.width}
      value={rowData.get(cell.label)}
    />
  ));
}

const Row = ({ className, rowData, rowMap }) => (
  <div className={`filter_table__row${className ? ` ${className}` : ''}`}>
    {generateCells(rowData, rowMap)} 
  </div>
);

Row.propTypes = {
  rowMap: PropTypes.array.isRequired,
  className: PropTypes.string,
  rowData: PropTypes.object.isRequired,
};


export default Row;
