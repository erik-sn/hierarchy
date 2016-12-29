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
    };
    this.handleFilterUpdate = this.handleFilterUpdate.bind(this);
    this.handleToggleMode = this.handleToggleMode.bind(this);
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

  handleFilterUpdate(filterText) {
    const filters = filterText.split(',').map(filter => filter.trim().toLowerCase()).filter(filter => filter);
    this.setState({ filters: List(filters), filterText });
  }

  handleToggleMode() {
    this.setState({ filterAny: !this.state.filterAny });
  }

  render() {
    const { tableData, className, rowMap, filter, csv } = this.props;
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
        <Header rowMap={rowMap} />
        <TableData filteredData={this.filterData(tableData)} rowMap={rowMap} />
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
