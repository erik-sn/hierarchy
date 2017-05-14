"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var filter_table_cell_1 = require("./filter_table_cell");
/**
 * Container component to order a row of table cells
 *
 * @param {any} { className, rowData, rowMap }
 */
var Row = (function (_super) {
    __extends(Row, _super);
    function Row(props) {
        var _this = _super.call(this, props) || this;
        _this.handleCellClick = _this.handleCellClick.bind(_this);
        return _this;
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
    Row.prototype.generateCells = function (rowData, config) {
        var _this = this;
        var classNames = rowData.classNames;
        return config.map(function (option, index) {
            var handleCellClick = function () { return _this.handleCellClick(index); };
            return (React.createElement(filter_table_cell_1.default, { key: index, handleClick: handleCellClick, width: option.width, value: rowData[option.label], className: classNames ? classNames[option.label] : '' }));
        });
    };
    /**
     * Click handler method passed to cells. Cells return their
     * column index and the rowData and column index are returned
     * to the parent.
     *
     * @param {number} columnIndex
     *
     * @memberOf Row
     */
    Row.prototype.handleCellClick = function (columnIndex) {
        var handleClick = this.props.handleClick;
        if (handleClick) {
            handleClick(this.props.rowData, columnIndex);
        }
    };
    Row.prototype.render = function () {
        var _a = this.props, rowData = _a.rowData, config = _a.config, className = _a.className;
        return (React.createElement("div", { className: "filter_table__row" + (className ? " " + className : '') }, this.generateCells(rowData, config)));
    };
    return Row;
}(React.Component));
exports.default = Row;
