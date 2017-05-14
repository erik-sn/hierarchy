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
var Infinite = require("react-infinite");
var filter_table_row_1 = require("./filter_table_row");
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
var TableData = (function (_super) {
    __extends(TableData, _super);
    function TableData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Return a list of Row components
     *
     * @param {function} handleRowClick - function called with row object when clicked
     * @returns {object} immutable list
     *
     * @memberOf TableData
     */
    TableData.prototype.generateRows = function (handleRowClick) {
        var _a = this.props, finalTableData = _a.finalTableData, config = _a.config;
        return finalTableData.map(function (data, i) { return (React.createElement(filter_table_row_1.default, { key: i, rowData: data, config: config, handleClick: handleRowClick })); });
    };
    TableData.prototype.render = function () {
        return (React.createElement("div", { className: "filter_table__row-container" },
            React.createElement(Infinite, { className: "filter-table-body", containerHeight: this.props.height || window.innerHeight - 300, elementHeight: 22 }, this.generateRows(this.props.handleRowClick))));
    };
    return TableData;
}(React.Component));
exports.default = TableData;
