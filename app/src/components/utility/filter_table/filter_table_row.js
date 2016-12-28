import React from 'react';

import Column from './filter_table_column';

// function generateColumns(rowData) {
//   return this.props.rowMap.map(column => (
//     <Column
//       className={column.className}
//       width={column.width}
//       value={rowData[column.label]}
//     />
//   ));
// } {this.generateColumns(props.rowData)}

const Row = props => (
  <div className={`filter_table__row${props.className? ` ${props.className}` : ''}`}>
    test
  </div>
);

Row.propTypes = {
  rowMap: PropTypes.object.isRequired,
  className: PropTypes.string,
  rowData: PropTypes.object.isRequired,
};


export default Row;