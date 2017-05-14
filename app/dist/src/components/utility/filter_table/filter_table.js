"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var React = require("react");
var library_1 = require("../../../utils/library");
var filter_csv_1 = require("./filter_csv");
var filter_table_data_1 = require("./filter_table_data");
var filter_table_filter_1 = require("./filter_table_filter");
var filter_table_header_column_1 = require("./filter_table_header_column");
var filter_table_results_1 = require("./filter_table_results");
var filter_table_total_1 = require("./filter_table_total");
var filter_toggle_1 = require("./filter_toggle");
/**
 * Responsible for outputting list of immutable Maps into a filterable,
 * sortable data table.
 *
 * @class FilterTable
 * @extends {Component}
 */
var FilterTable = (function (_super) {
    __extends(FilterTable, _super);
    /**
     * Creates an instance of FilterTable. Critical properties
     * are rowMap and tableData which define the configuration and
     * table rows respectively. This component and child components
     * work on Immutable.js, but we allow input properties to be in
     * regular JS - they are then converted to immutable on the constructor
     * method (and componentWillReceiveProps).
     *
     * @param {object} props
     *
     * @memberOf FilterTable
     */
    function FilterTable(props) {
        var _this = _super.call(this, props) || this;
        var tableData = props.tableData, config = props.config;
        // create a copy of the input data to work on
        var copiedTableData = _this.copyInputData(tableData);
        _this.checkConfig(config);
        _this.state = {
            filterText: '',
            filterAny: true,
            filters: [],
            sortParameter: undefined,
            sortDirection: undefined,
            // we pass tableData from props to state so that filters can be
            // applied to it
            tableData: _this.cleanTableData(copiedTableData),
        };
        _this.handleFilterUpdate = _this.handleFilterUpdate.bind(_this);
        _this.handleToggleMode = _this.handleToggleMode.bind(_this);
        _this.handleToggleSort = _this.handleToggleSort.bind(_this);
        _this.filterTableData = _this.filterTableData.bind(_this);
        _this.generateFilters = _this.generateFilters.bind(_this);
        return _this;
    }
    /**
     * Check to make sure that the tableData and rowMap properties
     * are immutable lists. If they are not (and therefore regular JS)
     * then convert them and their items to immutable data structures.
     *
     * @param {object} nextProps
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.componentWillReceiveProps = function (nextProps) {
        var tableData = nextProps.tableData;
        // create a copy of the input data to work on
        var copiedTableData = this.copyInputData(tableData);
        this.setState({ tableData: this.cleanTableData(copiedTableData) });
    };
    /**
     * If the raw tableData input prop is used it will be mutated during any
     * internal processing. As part of the searching algorithm we convert all
     * inputs to strings. This operation would convert the input data that was
     * passed to a string as well. Therefore we make a copy of the input data
     * and perform all operations on that copy.
     *
     * @param {Array<IDictionary<string>>} tableData - table data passed to the component as props
     * @returns {Array<IDictionary<string>>} - a copy of the table data
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.copyInputData = function (tableData) {
        return tableData.map(function (row) { return Object.assign({}, row); });
    };
    /**
     * Check for any missing parameters on the table configuration object. Required
     * parameters include:
     *
     * - header - the header displayed on the table to the user
     * - label - the key of a data object
     * - width - a percent or px string set on the table column as a width
     *
     * Optional parameters:
     *  - className - class applied to the column header
     *  - childrenClass - class applied to all cells of a column
     *  - transform - function used to generate a totals object
     *
     * @param {object} config - table configuration
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.checkConfig = function (config) {
        config.forEach(function (option, i) {
            ['header', 'label', 'width'].forEach(function (param) {
                if (!option.hasOwnProperty(param)) {
                    throw TypeError("Invalid table configuration object. Configuration option at index " + i + " \n                           is invalid. Missing parameter: " + param);
                }
            });
        });
    };
    /**
     * Given a string representing a filter and check to see if it is
     * surrounded by quotes (single or double). If so, then designate
     * the filter as an exact filter and remove the quotes.
     *
     * @param {string} filterValue
     * @returns {object} - exact designation and cleaned filter
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.parseAndCleanFilter = function (filterValue) {
        var exact = false;
        var cleanedFilterValue = filterValue;
        var ei = filterValue.length - 1; // end index
        if ((filterValue[0] === '"' || filterValue[0] === '\'') &&
            (filterValue[ei] === '"' || filterValue[ei] === '\'')) {
            exact = true;
            cleanedFilterValue = filterValue.replace(/["']/g, '');
        }
        return { exact: exact, cleanedFilterValue: cleanedFilterValue };
    };
    /**
     * cast an input to a string if it is "stringable" - test using falsy
     * values. Check for cases where the value is actually a false boolean
     * or the number 0 and string that.
     *
     * @param {any} value
     * @returns {string}
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.castToString = function (value) {
        if (typeof value === 'string') {
            return value;
        }
        if (value || value === false || value === 0) {
            return String(value);
        }
        return '';
    };
    /**
     * perform all cleaning options on the table data
     * - convert all data to strings, excluding the classnames key
     * which is used to set css classes on the object
     *
     * @param {object} tableData
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.cleanTableData = function (tableData) {
        var _this = this;
        return tableData.map(function (row) {
            for (var key in row) {
                if (row.hasOwnProperty(key) && key !== 'classNames') {
                    row[key] = _this.castToString(row[key]).trim();
                }
            }
            return row;
        });
    };
    FilterTable.prototype.parseDataLabel = function (filterKey) {
        var config = this.props.config;
        var option = config.find(function (configOption) { return (configOption.header.toLowerCase() === filterKey.toLowerCase()); });
        return option ? option.label : undefined;
    };
    /**
     * Generate a function predicate that compares the value of a specified
     * filter and compares it to an object's value at a specified key, returning
     * a boolean. Depending on whether or not the exact parameter is true use an
     * equals vs. contains approach. The predicate is case insensitive.
     *
     * @param {string} filterKey - "left hand" of equals sign operator in a filter
     * @param {string} filterValue - "right hand" of equals sign operator in a filter
     * @param {boolean} exact - whether or not to compare using an exact match.
     * @returns {function} filter function
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.generateKeyFilter = function (filterKey, filterValue, exact) {
        var dataLabel = this.parseDataLabel(filterKey);
        return function (row) {
            var dataValue = row[dataLabel] ? row[dataLabel].toLowerCase() : undefined;
            try {
                return exact ? dataValue === filterValue : dataValue.indexOf(filterValue) > -1;
            }
            catch (error) {
                return false;
            }
        };
    };
    /**
     * Generate a function that compares the value of a specified filter
     * to ALL values in an input data object. If at least one of the object values
     * match the filter value return true. Depending on whether or not the exact
     * parameter is true use a contains or equals comparison. Comparisons are
     * case insensitive.
     *
     * @param {string} filterValue - filter to search for
     * @param {boolean} exact - whether or not we are using an exact match
     * @returns {function} - true/false if there is a matching value
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.generateSomeFilter = function (filterValue, exact) {
        return function (row) {
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    var value = row[key];
                    if (exact && value.toLowerCase() === filterValue) {
                        return true;
                    }
                    else if (!exact && value.toLowerCase().indexOf(filterValue) > -1) {
                        return true;
                    }
                }
            }
            return false;
        };
    };
    /**
     * Given a raw filter string parse it to see if there is an "="
     * operator. If so declare the left hand side the key and right
     * hand side the value. If no "=" is present declare the entire
     * string the value and leave the key undefined. Return both in
     * an object
     *
     * @param {string} filter
     * @returns {object}
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.parseFilterParameters = function (filter) {
        var filterParameters = filter.split('=').map(function (param) { return param.trim(); }).filter(function (param) { return param; });
        var filterKey = filterParameters.length === 2 ? filterParameters[0].toLowerCase() : undefined;
        var filterValue = filterParameters.length === 2 ? filterParameters[1] : filterParameters[0];
        return { filterKey: filterKey, filterValue: filterValue };
    };
    /**
     * Given a raw filter string generate the corresponding filter function
     * based on the parameters of the filters.
     *
     * @param {string} filter
     * @returns
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.generateFilters = function (filter) {
        var _a = this.parseFilterParameters(filter), filterKey = _a.filterKey, filterValue = _a.filterValue;
        var _b = this.parseAndCleanFilter(filterValue), exact = _b.exact, cleanedFilterValue = _b.cleanedFilterValue;
        if (filterKey) {
            return this.generateKeyFilter(filterKey, cleanedFilterValue, exact);
        }
        return this.generateSomeFilter(cleanedFilterValue, exact);
    };
    /**
     * Given an immutable list filter it based on the user specified filters. Filter
     * functions are generated by parsing the raw filter strings into function
     * predicates.
     *
     * The filterAny state controls whether a row must pass at least one filter (some)
     *  or filters (every).
     *
     * @param {object} tableData - immutable list object containing all table rows
     * @returns {object} - filtered table data
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.filterTableData = function (tableData) {
        var _a = this.state, filters = _a.filters, filterAny = _a.filterAny;
        var filterFunctions = filters.map(this.generateFilters);
        if (filters.length > 0 && filterAny) {
            return tableData.filter(function (row) { return filterFunctions.some(function (filter) { return filter(row); }); });
        }
        else if (filters.length > 0) {
            return tableData.filter(function (row) { return filterFunctions.every(function (filter) { return filter(row); }); });
        }
        return tableData;
    };
    /**
     * Given raw user input from a text box, parse it into an array of strings
     * using comma as a delminator. Update state to reflect both the filter array
     * and raw text - text box is a controlled component
     *
     * @param {string} filterText
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.handleFilterUpdate = function (filterText) {
        var filters = filterText.split(',')
            .map(function (filter) { return (filter.trim().toLowerCase()); })
            .filter(function (filter) { return filter; });
        this.setState({ filters: filters, filterText: filterText });
    };
    /**
     *
     * Toggle the state of filterAny true/false. Called when user clicks on the
     * configuration icon.
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.handleToggleMode = function () {
        this.setState({ filterAny: !this.state.filterAny });
    };
    /**
     * Given an object parameter, a direction and a formatting function,
     * generate a sorting function that acts as a predicate for the general
     * sorting implementation.
     *
     * @param {string} sortParameter - object parameter to retrieve when sorting
     * @param {number} sortDirection - (1 = ascending, -1 = descending)
     * @param {function} formatData - an function that serves to format the data. If
     *                   nothing is specified simply return the input as is
     * @returns {function}
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.generateSortFunction = function (sortParameter, sortDirection, formatData) {
        return function (a, b) { return (formatData(a[sortParameter]) > formatData(b[sortParameter]) ? sortDirection : -1 * sortDirection); };
    };
    /**
     * Generate a function that takes in an input, formats it,
     * and then returns the formatted input. The tableData/parameter
     * is checked to see if it contains numbers, dates, or otherwise
     * strings. Depending on the type apply a certain format.
     *
     * @param {object} tableData - immutable list of immutable maps
     * @param {string} sortParameter - map parameter to sort by
     * @returns {function}
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.generateFormatData = function (tableData, sortParameter) {
        if (library_1.isNumberParameter(tableData, sortParameter)) {
            return function (input) { return Number(input); };
        }
        if (library_1.isMomentParameter(tableData, sortParameter)) {
            return function (input) { return moment(input); };
        }
        return function (input) { return input.toLowerCase(); };
    };
    /**
     * If any sorting parameters are active sort tableData using them,
     * otherwise return the tableData.
     *
     * @param {object} tableData - immutable list of immutable maps
     * @returns {object} - sorted list
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.sortTableData = function (tableData) {
        var _a = this.state, sortParameter = _a.sortParameter, sortDirection = _a.sortDirection;
        if (sortParameter && sortDirection !== undefined) {
            var formatData = this.generateFormatData(tableData, sortParameter);
            var sortFunction = this.generateSortFunction(sortParameter, sortDirection, formatData);
            return tableData.sort(sortFunction);
        }
        return tableData;
    };
    /**
     * When a table header is clicked pass it to this function
     * and determine what field parameter and what direction to
     * sort in. Direction of 1 is ascending, directon of 0 is
     * descending.
     *
     * If there is a sort already active and the clicked header is
     * a different parameter then by default set the sort direction
     * as 1.
     *
     * @param {string} header - header label that was clicked on
     *
     * @memberOf FilterTable
     */
    FilterTable.prototype.handleToggleSort = function (header) {
        var _a = this.state, sortDirection = _a.sortDirection, sortParameter = _a.sortParameter;
        var updatedSortParameter = header;
        var updatedSortDirection;
        switch (sortDirection) {
            case undefined:
                updatedSortDirection = 1;
                break;
            case 1:
                updatedSortDirection = -1;
                break;
            default:
                updatedSortParameter = undefined;
                updatedSortDirection = undefined;
                break;
        }
        this.setState({
            sortParameter: updatedSortParameter,
            sortDirection: updatedSortDirection,
        });
    };
    FilterTable.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, config = _a.config, showFilter = _a.showFilter, showCsv = _a.showCsv, showResults = _a.showResults, showTotals = _a.showTotals, handleRowClick = _a.handleRowClick, height = _a.height;
        var _b = this.state, tableData = _b.tableData, filterAny = _b.filterAny;
        var filteredTableData = this.filterTableData(tableData);
        var sortedTableData = this.sortTableData(filteredTableData);
        var ratio = sortedTableData.length + "/" + tableData.length;
        var percent = ((100 * sortedTableData.length) / tableData.length).toFixed(1);
        return (React.createElement("div", { className: "filter_table__container" + (className ? " " + className : '') },
            React.createElement("div", { className: "filter_table__filter-bar" },
                React.createElement("div", { className: "filter_table__filter-container" }, showFilter ?
                    React.createElement(filter_table_filter_1.default, { updateFilter: this.handleFilterUpdate, filterAny: this.state.filterAny }) : undefined),
                showFilter ?
                    React.createElement(filter_toggle_1.default, { filterAny: filterAny, handleClick: this.handleToggleMode }) : undefined,
                showCsv ? React.createElement(filter_csv_1.default, { tableData: sortedTableData, tableHeaders: config }) : undefined),
            React.createElement("div", { className: "filter_table__header" }, config.map(function (option, i) { return (React.createElement(filter_table_header_column_1.default, { key: i, handleClick: _this.handleToggleSort, option: option, sortDirection: _this.state.sortDirection, sortParameter: _this.state.sortParameter })); })),
            React.createElement(filter_table_data_1.default, { finalTableData: sortedTableData, config: config, handleRowClick: handleRowClick, height: height }),
            showTotals ? React.createElement(filter_table_total_1.default, { tableData: sortedTableData, config: config }) : undefined,
            showResults ? React.createElement(filter_table_results_1.default, { ratio: ratio, percent: percent }) : undefined));
    };
    return FilterTable;
}(React.Component));
exports.default = FilterTable;
