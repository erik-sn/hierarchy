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
    this.handleCellClick = this.handleCellClick.bind(this);
  }

  /**
   * Generate a row of cells based on the rowData object
   * and the table configuration object.
   *
   * Row objects can contain a classNames field which is a mapping
   * of CSS classes to column fields. This allows for custom CSS
   * classes to be applied to rows and will adjust for the filter.
   *
   * @param {object} rowData - immutable Map
   * @param {object} rowMap - immutable List, table configuration
   * @returns {object} - immutable List of JSX.Elements
   */
  generateCells(rowData, rowMap) {
    const classNames = rowData.get('classNames');
    return rowMap.map((config, index) => (
      <Cell
        key={index}
        handleClick={() => this.handleCellClick(index)}
        width={config.get('width')}
        value={rowData.get(config.get('label'))}
        className={classNames ? classNames.get(config.get('label')) : ''}
      />
    ));
  }

  /**
   * Click handler method passed to cells. Cells return their
   * column index and the rowData and column index are returned
   * to the parent.
   *
   * @param {number} columnIndex
   *
   * @memberOf Row
   */
  handleCellClick(columnIndex) {
    const { handleClick } = this.props;
    if (handleClick) {
      handleClick(this.props.rowData, columnIndex);
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
