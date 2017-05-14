"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
/**
 * Basic cell component for filter table
 *
 * @param {string, string, string} { width, className, value }
 */
var Cell = function (_a) {
    var width = _a.width, value = _a.value, className = _a.className, handleClick = _a.handleClick;
    return (React.createElement("div", { onClick: handleClick, style: { width: width }, className: "filter_table__cell" + (className ? " " + className : '') }, value));
};
exports.default = Cell;
