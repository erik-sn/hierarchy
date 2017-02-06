import {fromJS, is, List } from 'immutable';
import * as moment from 'moment';
import * as React from 'react';

import { IConfig, IDictionary } from '../../../constants/interfaces';
import { isMomentParameter, isNumberParameter } from '../../../utils/library';
import FilterCsv from './filter_csv';
import TableData from './filter_table_data';
import Filter from './filter_table_filter';
import HeaderColumn from './filter_table_header_column';
import TableTotal from './filter_table_total';
import FilterToggle from './filter_toggle';

interface IFilter {
  exact?: boolean;
  cleanedFilterValue?: string;
  filterKey?: string;
  filterValue?: string;
}


export interface IFilterTableProps {
  tableData: Array<IDictionary<string>>;
  className?: string;
  showFilter: boolean;
  showCsv: boolean;
  showResults: boolean;
  showTotals: boolean;
  config: IConfig[];
  handleRowClick: () => void;
}

export interface IFilterTableState {
  filterText: string;
  filterAny: boolean;
  filters: string[];
  sortParameter: string;
  sortDirection: number;
  tableData: Array<IDictionary<string>>;
}

/**
 * Responsible for outputting list of immutable Maps into a filterable,
 * sortable data table.
 *
 * @class FilterTable
 * @extends {Component}
 */
class FilterTable extends React.Component<IFilterTableProps, IFilterTableState> {

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
  constructor(props: IFilterTableProps) {
    super(props);
    const { tableData, config } = props;
    this.checkConfig(config);
    this.state = {
      filterText: '',
      filterAny: true,
      filters: [],
      sortParameter: undefined,
      sortDirection: undefined,
       // we pass tableData from props to state so that filters can be
       // applied to it
      tableData: this.cleanTableData(tableData),
    };
    this.handleFilterUpdate = this.handleFilterUpdate.bind(this);
    this.handleToggleMode = this.handleToggleMode.bind(this);
    this.handleToggleSort = this.handleToggleSort.bind(this);
    this.filterTableData = this.filterTableData.bind(this);
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
  public componentWillReceiveProps(nextProps: IFilterTableProps): void {
    const { tableData } = nextProps;
    this.setState({ tableData: this.cleanTableData(tableData) });
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
   * @param {object} config - table configuration
   *
   * @memberOf FilterTable
   */
  public checkConfig(config: IConfig[]): void{
    config.forEach((option, i) => {
      ['header', 'label', 'width'].forEach((param) => {
        if (!option.hasOwnProperty(param)) {
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
  public parseAndCleanFilter(filterValue: string): IFilter {
    let exact: boolean = false;
    let cleanedFilterValue: string = filterValue;
    const ei: number = filterValue.length - 1; // end index
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
  public castToString(value: string): string {
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
   * - convert all data to strings, excluding the classnames key
   * which is used to set css classes on the object
   *
   * @param {object} tableData
   *
   * @memberOf FilterTable
   */
  public cleanTableData(tableData: Array<IDictionary<string>>): Array<IDictionary<string>> {
    return tableData.map((row) => {
      for (const key in row) {
        if (row.hasOwnProperty(key) && key !== 'classNames') {
          row[key] = this.castToString(row[key]).trim();
        }
      }
      return row;
    });
  }

  public parseDataLabel(filterKey: string): string {
    const { config } = this.props;
    const option = config.find((configOption) => (
      configOption.header.toLowerCase() === filterKey.toLowerCase()
    ));
    return option ? option.label : undefined;
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
  public generateKeyFilter(filterKey: string,
                           filterValue: string,
                           exact: boolean): (row: IDictionary<string>) => boolean {
    const dataLabel: string = this.parseDataLabel(filterKey);
    return (row: IDictionary<string>) => {
      const dataValue = row[dataLabel] ? row[dataLabel].toLowerCase() : undefined;
      try {
        return exact ? dataValue === filterValue : dataValue.indexOf(filterValue) > -1;
      } catch (error) {
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
  public generateSomeFilter(filterValue: string, exact: boolean): (row: IDictionary<string>) => boolean {
    return (row: IDictionary<string>) => {
      for (let key in row) {
        if (row.hasOwnProperty(key)) {
          const value: string = row[key];
          return exact ? value.toLowerCase() === filterValue :
                         value.toLowerCase().indexOf(filterValue) > -1;
        }
      }
    };
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
  public parseFilterParameters(filter: string): IFilter {
    const filterParameters = filter.split('=').map((param) => param.trim()).filter((param) => param);
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
  public generateFilters(filter: string): (row: IDictionary<string>) => boolean {
    const { filterKey, filterValue }: IFilter = this.parseFilterParameters(filter);
    const { exact, cleanedFilterValue }: IFilter = this.parseAndCleanFilter(filterValue);
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
  public filterTableData(tableData: Array<IDictionary<string>>): Array<IDictionary<string>> {
    const { filters, filterAny } = this.state;
    const filterFunctions = filters.map(this.generateFilters);
    if (filters.length > 0 && filterAny) {
      return tableData.filter((row) => filterFunctions.some((filter) => filter(row)));
    } else if (filters.length > 0) {
      return tableData.filter((row) => filterFunctions.every((filter) => filter(row)));
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
  public handleFilterUpdate(filterText: string): void {
    const filters: string[] = filterText.split(',')
                              .map((filter) => (filter.trim().toLowerCase()))
                              .filter((filter) => filter);
    this.setState({ filters, filterText });
  }

  /**
   *
   * Toggle the state of filterAny true/false. Called when user clicks on the
   * configuration icon.
   *
   * @memberOf FilterTable
   */
  public handleToggleMode(): void {
    this.setState({ filterAny: !this.state.filterAny });
  }

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
  public generateSortFunction(sortParameter: string,
                              sortDirection: number,
                              formatData: (input: string) => string = (input) => input) {
    return (a: IDictionary<string>, b: IDictionary<string>) => (
      formatData(a[sortParameter]) > formatData(b[sortParameter]) ? sortDirection : -1 * sortDirection
    );
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
  public isNumberParameter(tableData: Array<IDictionary<string>>, parameter: string): boolean {
    return !tableData.some((row) => Number.isNaN(Number(row[parameter])));
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
  public generateFormatData(tableData: Array<IDictionary<string>>, sortParameter: string) {
    if (isNumberParameter(tableData, sortParameter)) {
      return (input: any) => Number(input);
    }
    if (isMomentParameter(tableData, sortParameter)) {
      return (input: any) => moment(input);
    }
    return (input: any) => typeof input === 'string' ? input.toLowerCase() : input;
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
  public sortTableData(tableData: Array<IDictionary<string>>) {
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
  public handleToggleSort(header: string): void {
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
          updatedSortDirection = -1;
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

  public render(): JSX.Element {
    const { className, config, showFilter, showCsv, showResults,
      showTotals, handleRowClick } = this.props;
    const { tableData, filterAny } = this.state;
    const filteredTableData = this.filterTableData(tableData);
    const sortedTableData = this.sortTableData(filteredTableData);
    const ratio = `${filteredTableData.length}/${tableData.length}`;
    const percent = ((100 * sortedTableData.length) / tableData.length).toFixed(1);
    return (
      <div className={`filter_table__container${className ? ` ${className}` : ''}`}>
        <div className="filter_table__filter-bar">
          <div className="filter_table__filter-container" >
            {showFilter ?
              <Filter
                updateFilter={this.handleFilterUpdate}
                filterAny={this.state.filterAny}
              /> : undefined}
          </div>
          {showFilter ?
            <FilterToggle
              filterAny={filterAny}
              handleClick={this.handleToggleMode}
            /> : undefined
          }
          {showCsv ? <FilterCsv tableData={sortedTableData} tableHeaders={config} /> : undefined}
        </div>
        <div className="filter_table__header" >
          {config.map((option, i) => (
            <HeaderColumn
              key={i}
              handleClick={this.handleToggleSort}
              option={option}
              sortDirection={this.state.sortDirection}
              sortParameter={this.state.sortParameter}
            />
          ))}
        </div>
        <TableData
          finalTableData={sortedTableData}
          config={config}
          handleRowClick={handleRowClick}
        />
        {showTotals ? <TableTotal tableData={sortedTableData} config={config} /> : undefined}
        {showResults ? <div>{`Displaying ${ratio} rows - ${percent}%`}</div> : undefined}
      </div>
    );
  }
}

export default FilterTable;
