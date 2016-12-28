import React, { Component, PropTypes } from 'react';

import Row from './filter_table_row';

class FilterTable extends Component {

  generateRows() {
    const { tableData, rowMap } = this.props;
    const rows = tableData.map((data, i) => <Row key={i} rowData={data} rowMap={rowMap} />);
    console.log(rows);
    return rows;
  }

  render() {
    const { tableData, className, filter, csv } = this.props;
    return (
      <div className={`filter_table__container${className ? ` ${className}` : ''}`}>
        <div className="filter_table__row-container">
          {this.generateRows()}
        </div>
      </div>
    );
  }

};


FilterTable.propTypes = {
  tableData: PropTypes.object.isRequired,
  className: PropTypes.string,
  filter: PropTypes.bool,
  csv: PropTypes.bool,
  rowMap: PropTypes.object.isRequired,
};

export default FilterTable;
