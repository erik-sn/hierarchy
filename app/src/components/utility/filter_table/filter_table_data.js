import React, { Component, PropTypes } from 'react';
import { is } from 'immutable';
import Infinite from 'react-infinite';
import Row from './filter_table_row';

class TableData extends Component {

  shouldComponentUpdate(nextProps) {
    return true;
    const { filteredData } = this.props;
    return !is(nextProps.filteredData, filteredData);
  }

  generateRows() {
    const { filteredData, rowMap } = this.props;
    return filteredData.map((data, i) => (
      <Row key={i} rowData={data} rowMap={rowMap} />
    ));
  }

  render() {
    return (
      <div className="filter_table__row-container">
        <Infinite
          className="filter-table-body"
          containerHeight={window.innerHeight - 250}
          elementHeight={22}
        >
          {this.generateRows()}
        </Infinite>
      </div>
    );
  }
}

TableData.propTypes = {
  filteredData: PropTypes.object.isRequired,
  rowMap: PropTypes.array.isRequired,
};

export default TableData;
