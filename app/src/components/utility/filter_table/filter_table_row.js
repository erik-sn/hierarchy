import React, { PropTypes } from 'react';

import Column from './filter_table_column';

function generateColumns(rowData, rowMap) {
  return rowMap.map((column, i) => (
    <Column
      key={i}
      className={rowData.get('classNames') ? rowData.get('classNames').get(column.label) : ''}
      width={column.width}
      value={rowData.get(column.label)}
    />
  ));
}

const Row = ({ className, rowData, rowMap }) => (
  <div className={`filter_table__row${className ? ` ${className}` : ''}`}>
    {generateColumns(rowData, rowMap)}
  </div>
);

Row.propTypes = {
  rowMap: PropTypes.array.isRequired,
  className: PropTypes.string,
  rowData: PropTypes.object.isRequired,
};


export default Row;
