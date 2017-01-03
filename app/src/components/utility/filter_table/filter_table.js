import React, { Component, PropTypes } from 'react';
import { fromJS, is, List } from 'immutable';
import moment from 'moment';
import AllIcon from 'material-ui/svg-icons/communication/clear-all';
import AnyIcon from 'material-ui/svg-icons/content/filter-list';

import { isMomentParameter, isNumberParameter } from '../../../utils/library';
import Csv from '../../csv_generator';
import Filter from './filter_table_filter';
import Header from './filter_table_header';
import TableData from './filter_table_data';
import TableTotal from './filter_table_total';

/**
 * Responsible for outputting list of immutable Maps into a filterable,
 * sortable data table.
 *
 * @class FilterTable
 * @extends {Component}
 */
class FilterTable extends Component {

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
  constructor(props) {
    super(props);
    const { tableData, rowMap } = props;
    const initialTableData = List.isList(tableData) ? tableData : fromJS(tableData);
    const initialRowMap = List.isList(rowMap) ? rowMap : fromJS(rowMap);
    this.checkRowMap(initialRowMap);
    this.state = {
      filterText: '',
      filterAny: true,
      filters: List([]),
      sortParameter: undefined,
      sortDirection: undefined,
      tableData: this.cleanData(initialTableData),
      rowMap: initialRowMap,
    };
    this.handleFilterUpdate = this.handleFilterUpdate.bind(this);
    this.handleToggleMode = this.handleToggleMode.bind(this);
    this.handleToggleSort = this.handleToggleSort.bind(this);
    this.filterData = this.filterData.bind(this);
    this.generateFilters = this.generateFilters.bind(this);
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
  componentWillReceiveProps(nextProps) {
    const { tableData, rowMap } = nextProps;
    const nextTableData = List.isList(tableData) ? tableData : fromJS(tableData);
    const nextRowMap = List.isList(rowMap) ? rowMap : fromJS(rowMap);
    const update = {};
    if (!is(this.state.tableData, nextTableData)) {
      update.tableData = this.cleanData(nextTableData);
    }
    if (!is(this.state.rowMap, nextRowMap)) {
      this.checkRowMap(nextRowMap);
      update.rowMap = nextRowMap;
    }
    this.setState(update);
  }

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
   * @param {object} rowMap - table configuration
   *
   * @memberOf FilterTable
   */
  checkRowMap(rowMap) {
    rowMap.forEach((option, i) => {
      ['header', 'label', 'width'].forEach((param) => {
        if (!option.has(param)) {
          throw TypeError(`Invalid table configuration object. Configuration option at index ${i} 
                           is invalid. Missing parameter: ${param}`);
        }
      });
    });
  }

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
  cleanFilter(filterValue) {
    let exact = false;
    let cleanedFilterValue = filterValue;
    const ei = filterValue.length - 1; // end index
    if ((filterValue[0] === '"' || filterValue[0] === "'") &&
        (filterValue[ei] === '"' || filterValue[ei] === "'")) {
      exact = true;
      cleanedFilterValue = filterValue.replace(/["']/g, '');
    }
    return { exact, cleanedFilterValue };
  }

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
  castToString(value) {
    if (typeof value === 'string') {
      return value;
    }
    if (value || value === false || value === 0) {
      return String(value);
    }
    return '';
  }

  /**
   * perform all cleaning options on the table data
   * - convert all data to strings
   *
   * @param {object} tableData
   *
   * @memberOf FilterTable
   */
  cleanData(tableData) {
    return tableData.map(row => row.map(value => this.castToString(value).trim()));
  }

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
  generateKeyFilter(filterKey, filterValue, exact) {
    const { rowMap } = this.state;
    const option = rowMap.find(rowMapOption => (
      rowMapOption.get('header').toLowerCase() === filterKey.toLowerCase()
    ));
    const dataLabel = option ? option.get('label') : undefined;
    return (data) => {
      const dataValue = data.get(dataLabel) ? data.get(dataLabel).toLowerCase() : undefined;
      try {
        return exact ? dataValue === filterValue : dataValue.indexOf(filterValue) > -1;
      } catch (error) {
        console.error('Data Value was undefined');
        return false;
      }
    };
  }

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
  generateSomeFilter(filterValue, exact) {
    let predicate = value => value.toLowerCase().indexOf(filterValue) > -1;
    if (exact) {
      predicate = value => value.toLowerCase() === filterValue;
    }
    return data => data.some(predicate);
  }

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
  parseFilterParameters(filter) {
    const filterParameters = filter.split('=').map(param => param.trim()).filter(param => param);
    const filterKey = filterParameters.length === 2 ? filterParameters[0].toLowerCase() : undefined;
    const filterValue = filterParameters.length === 2 ? filterParameters[1] : filterParameters[0];
    return { filterKey, filterValue };
  }

  /**
   * Given a raw filter string generate the corresponding filter function
   * based on the parameters of the filters.
   *
   * @param {string} filter
   * @returns
   *
   * @memberOf FilterTable
   */
  generateFilters(filter) {
    const { filterKey, filterValue } = this.parseFilterParameters(filter);
    const { exact, cleanedFilterValue } = this.cleanFilter(filterValue);
    if (filterKey) {
      return this.generateKeyFilter(filterKey, cleanedFilterValue, exact);
    }
    return this.generateSomeFilter(cleanedFilterValue, exact);
  }

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
  filterData(tableData) {
    const { filters, filterAny } = this.state;
    const filterFunctions = filters.map(this.generateFilters);
    if (filters.size > 0 && filterAny) {
      return tableData.filter(row => filterFunctions.some(filter => filter(row)));
    } else if (filters.size > 0) {
      return tableData.filter(row => filterFunctions.every(filter => filter(row)));
    }
    return tableData;
  }

  /**
   * Given raw user input from a text box, parse it into an array of strings
   * using comma as a delminator. Update state to reflect both the filter array
   * and raw text - text box is a controlled component
   *
   * @param {string} filterText
   *
   * @memberOf FilterTable
   */
  handleFilterUpdate(filterText) {
    const filters = filterText.split(',').map(filter => filter.trim().toLowerCase()).filter(filter => filter);
    this.setState({ filters: List(filters), filterText });
  }

  /**
   *
   * Toggle the state of filterAny true/false. Called when user clicks on the
   * configuration icon.
   *
   * @memberOf FilterTable
   */
  handleToggleMode() {
    this.setState({ filterAny: !this.state.filterAny });
  }

  /**
   *
   * Given an object parameter, a direction and a formatting function,
   * generate a sorting function that acts as a predicate for the general
   * sorting implementation.
   *
   * @param {string} sortParameter - object parameter to retrieve when sorting
   * @param {number} sortDirection - 1 = ascending, 0 = descending
   * @param {function} formatData - an function that serves to format the data. If
   *                   nothing is specified simply return the input as is
   * @returns {function}
   *
   * @memberOf FilterTable
   */
  generateSortFunction(sortParameter, sortDirection, formatData = input => input) {
    if (sortDirection === 1) {
      return (a, b) => (
        formatData(a.get(sortParameter)) > formatData(b.get(sortParameter)) ? 1 : -1
      );
    }
    return (a, b) => (formatData(a.get(sortParameter)) < formatData(b.get(sortParameter)) ? 1 : -1);
  }

  /**
   * Iterate over the input list and check whether or not all members
   * of an object are or can be converted to numbers. If any value cannot
   * be converted return false, otherwise true.
   *
   * @param {object} list - immutable list of immutable map objects
   * @param {string} parameter - the field of a map object for which each map is checked
   * @returns {boolean}
   *
   * @memberOf FilterTable
   */
  isNumberParameter(list, parameter) {
    return !list.some(data => Number.isNaN(Number(data.get(parameter))));
  }


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
  generateFormatData(tableData, sortParameter) {
    if (isNumberParameter(tableData, sortParameter)) {
      return input => Number(input);
    }
    if (isMomentParameter(tableData, sortParameter)) {
      return input => moment(input);
    }
    return input => input.toLowerCase();
  }

  /**
   * If any sorting parameters are active sort tableData using them,
   * otherwise return the tableData.
   *
   * @param {object} tableData - immutable list of immutable maps
   * @returns {object} - sorted list
   *
   * @memberOf FilterTable
   */
  sortData(tableData) {
    const { sortParameter, sortDirection } = this.state;
    if (sortParameter && sortDirection !== undefined) {
      const formatData = this.generateFormatData(tableData, sortParameter);
      const sortFunction = this.generateSortFunction(sortParameter, sortDirection, formatData);
      return tableData.sort(sortFunction);
    }
    return tableData;
  }

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
  handleToggleSort(header) {
    const { sortDirection, sortParameter } = this.state;
    let updatedSortParameter = header;
    let updatedSortDirection;
    if (header !== sortParameter) {
      updatedSortDirection = 1;
    } else {
      switch (sortDirection) {
        case undefined:
          updatedSortDirection = 1;
          break;
        case 1:
          updatedSortDirection = 0;
          break;
        default:
          updatedSortParameter = undefined;
          break;
      }
    }
    this.setState({
      sortParameter: updatedSortParameter,
      sortDirection: updatedSortDirection,
    });
  }

  render() {
    const { className, filter, csv, results, totals, handleRowClick } = this.props;
    const { tableData, rowMap } = this.state;
    const filteredTableData = this.filterData(tableData);
    const sortedTableData = this.sortData(filteredTableData);
    const ratio = `${filteredTableData.size}/${tableData.size}`;
    const percent = ((100 * sortedTableData.size) / tableData.size).toFixed(1);
    return (
      <div className={`filter_table__container${className ? ` ${className}` : ''}`}>
        <div className="filter_table__filter-bar">
          <div className="filter_table__filter-container" >
            {filter ?
              <Filter
                tableData={sortedTableData}
                filter={this.state.filterText}
                updateFilter={this.handleFilterUpdate}
                filterAny={this.state.filterAny}
              /> : undefined}
          </div>
          {filter ?
            <div className="filter_table__mode-container" onClick={this.handleToggleMode} >
              {this.state.filterAny ? <AllIcon /> : <AnyIcon />}
              <div className="tooltip__text">Toggle Filter Mode</div>
            </div> : undefined
          }
          {csv ?
            <div className="filter_table__csv-container">
              <Csv
                fileName={`ProcessWorkshop_${moment().format('MMDDYY-HHmm')}`}
                data={sortedTableData.toJS()}
                params={rowMap.toJS()}
              />
              <div className="tooltip__text">Download CSV</div>
            </div> : undefined}
        </div>
        <Header
          rowMap={rowMap}
          handleClick={this.handleToggleSort}
          sortDirection={this.state.sortDirection}
          sortParameter={this.state.sortParameter}
        />
        <TableData finalTableData={sortedTableData} rowMap={rowMap} handleRowClick={handleRowClick} />
        {totals ? <TableTotal tableData={sortedTableData} rowMap={rowMap} /> : undefined}
        {results ? <div>{`Displaying ${ratio} rows - ${percent}%`}</div> : undefined}
      </div>
    );
  }
}

/**
 * tableData - an immutable list of immutable maps.
 */
FilterTable.propTypes = {
  tableData: PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
  ]).isRequired,
  className: PropTypes.string,
  filter: PropTypes.bool,
  csv: PropTypes.bool,
  results: PropTypes.bool,
  totals: PropTypes.bool,
  rowMap: PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
  ]).isRequired,
  handleRowClick: PropTypes.func,
};

export default FilterTable;
