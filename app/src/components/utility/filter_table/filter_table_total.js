import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';

import Row from './filter_table_row';

function getBaseValues(rowMap) {
  return rowMap.reduce((values, row) => (
    values.set(row.get('label'), List([]))
  ), Map({}));
}

function updateValues(values, row) {
  let updatedValues = values;
  row.forEach((value, key) => {
    updatedValues = updatedValues.set(key, updatedValues.get(key).push(value));
  });
  return updatedValues;
}

function getRowValues(tableData, rowMap) {
  return tableData.reduce((values, row) => (
    updateValues(values, row)), getBaseValues(rowMap)
  );
}
function applyTransforms(config, rowValues) {
  return config.get('transform') ? config.get('transform')(rowValues, config.get('label')) : '';
}

const TableTotal = ({ tableData, rowMap }) => {
  const rowValues = getRowValues(tableData, rowMap);
  const rowData = rowMap.reduce((rowData, config) => {
    return rowData.set(config.get('label'), applyTransforms(config, rowValues));
  }, Map({}));

  return (
    <div className="filter_table__totals-container">
      <Row rowMap={rowMap} rowData={rowData} />
    </div>
  );
};

TableTotal.propTypes = {
  tableData: PropTypes.object.isRequired,
  rowMap: PropTypes.object.isRequired,
};

export default TableTotal;
