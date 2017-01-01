import React, { Component, PropTypes } from 'react';
import { is } from 'immutable';
import Infinite from 'react-infinite';
import Row from './filter_table_row';

/**
 * Contains filter table rows in an infinite list. The infinite
 * list enormously helps improve render performance, especially
 * for large data sets.
 *
 * See: https://github.com/seatgeek/react-infinite
 *
 * @class TableData
 * @extends {Component}
 */
class TableData extends Component {

  /**
   * Only update when the row data has changed
   *
   * @param {object} nextProps
   * @returns {boolean}
   *
   * @memberOf TableData
   */
  shouldComponentUpdate(nextProps) {
    const { finalTableData } = this.props;
    return !is(nextProps.filteredData, finalTableData);
  }

  /**
   * Return a list of Row components
   *
   * @returns {object} immutable list
   *
   * @memberOf TableData
   */
  generateRows() {
    const { finalTableData, rowMap } = this.props;
    return finalTableData.map((data, i) => (
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

/**
 * finalTableData - list of table data after it has
 * been sorted and filteredData
 *
 * rowMap - table configuration
 */
TableData.propTypes = {
  finalTableData: PropTypes.object.isRequired,
  rowMap: PropTypes.object.isRequired,
};

export default TableData;
