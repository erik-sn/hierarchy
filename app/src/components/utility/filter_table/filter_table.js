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

class FilterTable extends Component {

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

  generateHeaders() {
    const { rowMap } = this.props;
    return <Row rowMap={rowMap} header />;
  }

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

  generateKeyFilter(filterKey, filterValue, exact) {
    const { rowMap } = this.props;
    const option = rowMap.find(rowMapOption => rowMapOption.get('header') === filterKey);
    const dataLabel = option ? option.get('label') : undefined;
    return (data) => {
      const dataValue = data.get(dataLabel) ? data.get(dataLabel).toLowerCase() : undefined;
      return exact ? dataValue === filterValue : dataValue.indexOf(filterValue) > -1;
    };
  }

  generateSomeFilter(filterValue, exact) {
    if (exact) {
      return data => data.some(value => value.toLowerCase() === filterValue);
    }
    return data => data.some(value => value.toLowerCase().indexOf(filterValue) > -1);
  }

  generateFilters(filter) {
    const filterParameters = filter.split('=').map(param => param.trim()).filter(param => param);
    const filterKey = filterParameters.length === 2 ? filterParameters[0] : undefined;
    const filterValue = filterParameters.length === 2 ? filterParameters[1] : filterParameters[0];
    const { exact, cleanedFilterValue } = this.cleanFilter(filterValue);
    if (filterKey) {
      return this.generateKeyFilter(filterKey, cleanedFilterValue, exact);
    }
    return this.generateSomeFilter(cleanedFilterValue, exact);
  }

  filterData(tableData) {
    const { filters, filterAny } = this.state;
    const filterFunctions = filters.map(this.generateFilters);
    if (filters.size > 0 && filterAny) {
      return tableData.filter(data => filterFunctions.some(filter => filter(data)));
    } else if (filters.size > 0) {
      return tableData.filter(data => filterFunctions.every(filter => filter(data)));
    }
    return tableData;
  }

  handleFilterUpdate(filterText) {
    const filters = filterText.split(',').map(filter => filter.trim().toLowerCase()).filter(filter => filter);
    this.setState({ filters: List(filters), filterText });
  }

  handleToggleMode() {
    this.setState({ filterAny: !this.state.filterAny });
  }

  generateSortFunction(sortParameter, sortDirection, formatData) {
    if (sortDirection === 1) {
      return (a, b) => (
        formatData(a.get(sortParameter)) > formatData(b.get(sortParameter)) ? 1 : -1
      );
    }
    return (a, b) => (formatData(a.get(sortParameter)) < formatData(b.get(sortParameter)) ? 1 : -1);
  }

  generateFormatData(tableData, sortParameter) {
    const numberTest = tableData.some(data => Number.isNaN(Number(data.get(sortParameter))));
    if (!numberTest) {
      return input => Number(input);
    }
    const dateTest = tableData.some(data => !moment(data.get(sortParameter)).isValid());
    if (!dateTest) {
      return input => moment(input);
    }
    return input => input.toLowerCase();
  }

  sortData(tableData) {
    const { sortParameter, sortDirection } = this.state;
    if (sortParameter && sortDirection !== undefined) {
      const formatData = this.generateFormatData(tableData, sortParameter);
      const sortFunction = this.generateSortFunction(sortParameter, sortDirection, formatData);
      return tableData.sort(sortFunction);
    }
    return tableData;
  }

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
