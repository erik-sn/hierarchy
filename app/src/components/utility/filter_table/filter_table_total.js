import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';

import Row from './filter_table_row';

/**
 * Generate an immutable map with keys for each configuration
 * object, and values being empty immutable lists.
 *
 * @param {object} rowMap - table configuration object
 * @returns
 */
function getBaseValues(rowMap) {
  return rowMap.reduce((values, row) => (
    values.set(row.get('label'), List([]))
  ), Map({}));
}

/**
 * iterate over a table row and update the baseValues to include the
 * data for each column
 *
 * @param {object} baseValues - generated key/value map with keys representing
 * each configuration option and values being lists of column data
 * @param {object} row - immutable map representing table row
 * @returns
 */
function updateValues(baseValues, row) {
  let updatedValues = baseValues;
  row.forEach((value, key) => {
    updatedValues = updatedValues.set(key, updatedValues.get(key).push(value));
  });
  return updatedValues;
}

/**
 * For each column in a table generate a key/value pair where the
 * key is the column label and the value is an immutable list containing
 * all of that column's data.
 *
 * @param {object} tableData - immutable list of immutable maps representing table data
 * @param {object} rowMap - table configuration object
 * @returns
 */
function getRowValues(tableData, rowMap) {
  return tableData.reduce((values, row) => (
    updateValues(values, row)), getBaseValues(rowMap)
  );
}

/**
 * A transform is a function that takes in the generated rowValues
 * (column data) and the column label and returns a value that is
 * representative of the total of that column. This abstraction provides
 * an interface for the developer to define sum, averaging, or any other
 * functions to be applied to the data set without making assumptions about
 * it.
 *
 * Here we apply these transforms (if they are specified in the config object)
 * to the data and return their values to be used in the total row. If none are
 * specified return an empty string.
 *
 * @param {object} rowMap - table configuration object
 * @param {object} rowValues - column data
 * @returns
 */
function applyTransforms(rowMap, rowValues) {
  return rowMap.get('transform') ? rowMap.get('transform')(rowValues, rowMap.get('label')) : '';
}

/**
 * Generate an immutable map representing the "totals" of a column.
 *
 * @param {object} rowMap - table configuration object
 * @param {object} tableData - immutable list of immutable maps representing table data
 * @returns
 */
function getTotalData(rowMap, tableData) {
  const rowValues = getRowValues(tableData, rowMap);
  return rowMap.reduce((rowData, config) => (
    rowData.set(config.get('label'), applyTransforms(config, rowValues))
  ), Map({}));
}

/**
 * A row of data representing totals
 *
 * @param {any} { tableData, rowMap }
 * @returns
 */
const TableTotal = ({ tableData, rowMap }) => (
  <div className="filter_table__totals-container">
    <Row rowMap={rowMap} rowData={getTotalData(rowMap, tableData)} />
  </div>
);

TableTotal.propTypes = {
  tableData: PropTypes.object.isRequired,
  rowMap: PropTypes.object.isRequired,
};

export default TableTotal;
