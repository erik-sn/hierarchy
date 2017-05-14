"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var filter_table_row_1 = require("./filter_table_row");
/**
 * Generate an immutable map with keys for each configuration
 * object, and values being empty immutable lists.
 *
 * @param {object} config - table configuration object
 * @returns
 */
function getBaseValues(config) {
    return config.reduce(function (values, option) {
        values[option.label] = [];
        return values;
    }, {});
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
    var updatedValues = baseValues;
    for (var key in row) {
        if (row.hasOwnProperty(key)) {
            var resultValues = updatedValues[key];
            resultValues.push(row[key]); // add value to results
            updatedValues[key] = resultValues;
        }
    }
    return updatedValues;
}
/**
 * For each column in a table generate a key/value pair where the
 * key is the column label and the value is an immutable list containing
 * all of that column's data.
 *
 * @param {object} tableData - immutable list of immutable maps representing table data
 * @param {object} config - table configuration object
 * @returns
 */
function getRowValues(tableData, config) {
    return tableData.reduce(function (values, row) { return (updateValues(values, row)); }, getBaseValues(config));
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
 * @param {IConfig} config - table configuration object
 * @param {IDictionary<any>} rowValues - column data
 * @returns
 */
function applyTransforms(config, rowValues) {
    return config.transform ? config.transform(rowValues, config.label) : '';
}
/**
 * Generate an immutable map representing the "totals" of a column.
 *
 * @param {object} config - table configuration object
 * @param {object} tableData - immutable list of immutable maps representing table data
 * @returns
 */
function getTotalData(config, tableData) {
    var rowValues = getRowValues(tableData, config);
    var initialRowData = {};
    return config.reduce(function (rowData, option) {
        rowData[option.label] = applyTransforms(option, rowValues);
        return rowData;
    }, initialRowData);
}
/**
 * A row of data representing totals
 *
 * @param {any} { tableData, rowMap }
 * @returns
 */
var TableTotal = function (_a) {
    var tableData = _a.tableData, config = _a.config;
    return (React.createElement("div", { className: "filter_table__totals-container" },
        React.createElement(filter_table_row_1.default, { config: config, rowData: getTotalData(config, tableData) })));
};
exports.default = TableTotal;
