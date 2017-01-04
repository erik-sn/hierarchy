import React, { Component, PropTypes } from 'react';

import Cell from './filter_table_cell';



/**
 * Container component to order a row of table cells
 *
 * @param {any} { className, rowData, rowMap }
 */
class Row extends Component {

  /**
   * Generate a row of cells based on the rowData object
   * and the table configuration object.
   * 
   * @param {object} rowData - immutable Map
   * @param {object} rowMap - immutable List, table configuration
   * @returns {object} - immutable List of JSX.Elements
   */
  generateCells(rowData, rowMap) {
    return rowMap.map((config, i) => (
      <Cell
        key={i}
        handleClick={this.props.handleClick}
        column={i}
        config={config}
        rowData={rowData}
      />
    ));
  }

  render() {
    const { rowData, rowMap, className } = this.props;
    return (
      <div onClick={this.handleClick} className={`filter_table__row${className ? ` ${className}` : ''}`}>
        {this.generateCells(rowData, rowMap)}
      </div>
    );
  }
}

Row.propTypes = {
  rowMap: PropTypes.object.isRequired,
  className: PropTypes.string,
  rowData: PropTypes.object.isRequired,
  handleClick: PropTypes.func,
};

export default Row;
