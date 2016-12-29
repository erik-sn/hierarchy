import React, { Component, PropTypes } from 'react';
import { List } from 'immutable';
import moment from 'moment';
import AllIcon from 'material-ui/svg-icons/communication/clear-all';
import AnyIcon from 'material-ui/svg-icons/content/filter-list';

import Csv from '../../csv_generator';
import Filter from './filter_table_filter';
import Header from './filter_table_header';
import Row from './filter_table_row';
import TableData from './filter_table_data';

/**
 * Responsible for outputting list of immutable Maps into a filterable,
 * sortable data table.
 *
 * @class FilterTable
 * @extends {Component}
 */
class FilterTable extends Component {

  /**
   * Creates an instance of FilterTable.
   *
   * @param {any} props
   *
   * @memberOf FilterTable
   */
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      filterAny: true,
      filters: List([]),
      sortParameter: undefined,
      sortDirection: undefined,
    };
    this.handleFilterUpdate = this.handleFilterUpdate.bind(this);
    this.handleToggleMode = this.handleToggleMode.bind(this);
    this.handleToggleSort = this.handleToggleSort.bind(this);
    this.filterData = this.filterData.bind(this);
    this.generateFilters = this.generateFilters.bind(this);
  }

  /**
   * Generate the table headers
   *
   * @returns JSX.Element
   * @memberOf FilterTable
   */
  generateHeaders() {
    const { rowMap } = this.props;
    return <Row rowMap={rowMap} header />;
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
    const { rowMap } = this.props;
    const option = rowMap.find(rowMapOption => rowMapOption.get('header') === filterKey);
    const dataLabel = option ? option.get('label') : undefined;
    return (data) => {
      const dataValue = data.get(dataLabel) ? data.get(dataLabel).toLowerCase() : undefined;
      return exact ? dataValue === filterValue : dataValue.indexOf(filterValue) > -1;
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
    const filterKey = filterParameters.length === 2 ? filterParameters[0] : undefined;
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
   *
   *
   * @memberOf FilterTable
   */
  handleToggleMode() {
    this.setState({ filterAny: !this.state.filterAny });
  }

  /**
   *
   *
   * @param {any} sortParameter
   * @param {any} sortDirection
   * @param {any} formatData
   * @returns
   *
   * @memberOf FilterTable
   */
  generateSortFunction(sortParameter, sortDirection, formatData) {
    if (sortDirection === 1) {
      return (a, b) => (
        formatData(a.get(sortParameter)) > formatData(b.get(sortParameter)) ? 1 : -1
      );
    }
    return (a, b) => (formatData(a.get(sortParameter)) < formatData(b.get(sortParameter)) ? 1 : -1);
  }

  /**
   *
   *
   * @param {any} list
   * @param {any} parameter
   * @returns
   *
   * @memberOf FilterTable
   */
  isNumberParameter(list, parameter) {
    return !list.some(data => Number.isNaN(Number(data.get(parameter))));
  }

  /**
   *
   *
   * @param {any} list
   * @param {any} parameter
   * @returns
   *
   * @memberOf FilterTable
   */
  isMomentParameter(list, parameter) {
    return !list.some(data => !moment(data.get(parameter)).isValid());
  }

  /**
   *
   *
   * @param {any} tableData
   * @param {any} sortParameter
   * @returns
   *
   * @memberOf FilterTable
   */
  generateFormatData(tableData, sortParameter) {
    if (this.isNumberParameter(tableData, sortParameter)) {
      return input => Number(input);
    }
    if (this.isMomentParameter(tableData, sortParameter)) {
      return input => moment(input);
    }
    return input => input.toLowerCase();
  }

  /**
   *
   *
   * @param {any} tableData
   * @returns
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
   *
   *
   * @param {any} header
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

  /**
   *
   *
   * @returns
   *
   * @memberOf FilterTable
   */
  render() {
    const { tableData, className, rowMap, filter, csv, results } = this.props;
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
                tableData={tableData}
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
        <TableData filteredData={sortedTableData} rowMap={rowMap} />
        {results ? <div>{`Displaying ${ratio} rows - ${percent}%`}</div> : undefined}
      </div>
    );
  }
}

FilterTable.propTypes = {
  tableData: PropTypes.object.isRequired,
  className: PropTypes.string,
  filter: PropTypes.bool,
  csv: PropTypes.bool,
  rowMap: PropTypes.object.isRequired,
};

export default FilterTable;
