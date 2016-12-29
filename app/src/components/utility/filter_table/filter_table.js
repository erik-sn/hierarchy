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
  }

  generateHeaders() {
    const { rowMap } = this.props;
    return <Row rowMap={rowMap} header />;
  }

  matchFilter(filter, data) {
    return data.some(value => value.toLowerCase().indexOf(filter) > -1);
  }

  filterData(tableData) {
    const { filters, filterAny } = this.state;
    if (filters.size > 0 && filterAny) {
      return tableData.filter(data => filters.some(filter => this.matchFilter(filter, data)));
    } else if (filters.size > 0) {
      return tableData.filter(data => filters.every(filter => this.matchFilter(filter, data)));
    }
    return tableData;
  }

  generateSortFunction(sortParameter, sortDirection, formatData) {
    if (sortDirection === 1) {
      return (a, b) => formatData(a.get(sortParameter)) > formatData(b.get(sortParameter)) ? 1 : -1;
    }
    return (a, b) => formatData(a.get(sortParameter)) < formatData(b.get(sortParameter)) ? 1 : -1;
  }

  generateFormatData(tableData, sortParameter) {
    const numberTest = tableData.some(data => Number.isNaN(Number(data.get(sortParameter))));
    if (!numberTest) {;
      return (input) => Number(input);
    }
    const dateTest = tableData.some(data => !moment(data.get(sortParameter)).isValid());
    if (!dateTest) {
      return (input) => moment(input);
    }
    return (input) => input.toLowerCase();
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

  handleFilterUpdate(filterText) {
    const filters = filterText.split(',').map(filter => filter.trim().toLowerCase()).filter(filter => filter);
    this.setState({ filters: List(filters), filterText });
  }

  handleToggleMode() {
    this.setState({ filterAny: !this.state.filterAny });
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
          updatedSortDirection = 1
          break;
        case 1:
          updatedSortDirection = 0
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
    const { tableData, className, rowMap, filter, csv } = this.props;
    const filteredTableData = this.filterData(tableData);
    const sortedTableData = this.sortData(filteredTableData);
    const ratio = `${filteredTableData.size}/${tableData.size}`;
    const percent = (100 * sortedTableData.size / sortedTableData.size).toFixed(1);
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
          <div className="filter_table__csv-container">
            {csv ?
              <Csv
                fileName={`ProcessWorkshop_${moment().format('MMDDYY-HHmm')}`}
                data={tableData.toJS()}
                params={rowMap}
              />
              : undefined}
            {csv ? <div className="tooltip__text">Download CSV</div> : undefined}
          </div>
        </div>
        <Header
          rowMap={rowMap}
          handleClick={this.handleToggleSort}
          sortDirection={this.state.sortDirection}
          sortParameter={this.state.sortParameter}
        />
        <TableData filteredData={sortedTableData} rowMap={rowMap} />
        <div>{`Displaying ${ratio} rows - ${percent}%`}</div>
      </div>
    );
  }
};


FilterTable.propTypes = {
  tableData: PropTypes.object.isRequired,
  className: PropTypes.string,
  filter: PropTypes.bool,
  csv: PropTypes.bool,
  rowMap: PropTypes.array.isRequired,
};

export default FilterTable;
