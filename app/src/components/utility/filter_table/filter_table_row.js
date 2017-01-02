import React, { Component, PropTypes } from 'react';

import Cell from './filter_table_cell';



/**
 * Container component to order a row of table cells
 *
 * @param {any} { className, rowData, rowMap }
 */
class Row extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this, props.rowData);
  }

  /**
   * Generate a row of cells based on the rowData object
   * and the table configuration object.
   * 
   * @param {object} rowData - immutable Map
   * @param {object} rowMap - immutable List, table configuration
   * @returns {object} - immutable List of JSX.Elements
   */
  generateCells(rowData, rowMap) {
    return rowMap.map((cell, i) => (
      <Cell
        key={i}
        className={cell.get('childrenClass')}
        width={cell.get('width')}
        value={rowData.get(cell.get('label'))}
      />
    ));
  }

  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick(this.props.rowData);
    }
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
