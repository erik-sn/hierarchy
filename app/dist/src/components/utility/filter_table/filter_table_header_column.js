"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var arrow_drop_down_1 = require("material-ui/svg-icons/navigation/arrow-drop-down");
var arrow_drop_up_1 = require("material-ui/svg-icons/navigation/arrow-drop-up");
var React = require("react");
/**
 * Return an icon depending on whether or not the sort
 * parameter matches the column header label, and which
 * direction we are sorting in
 *
 * @param {string} parameter - sort parameter
 * @param {string} label - column header label
 * @param {number} direction - 1 = ascending, 0 = descending
 * @returns {JSX.Element} - Icon
 */
function generateSortIcon(parameter, label, direction) {
    if (parameter === label && direction === 1) {
        return React.createElement(arrow_drop_up_1.default, null);
    }
    else if (parameter === label && direction === -1) {
        return React.createElement(arrow_drop_down_1.default, null);
    }
}
var HeaderColumn = function (_a) {
    var option = _a.option, sortParameter = _a.sortParameter, sortDirection = _a.sortDirection, handleClick = _a.handleClick;
    var width = option.width, header = option.header, label = option.label, childrenClass = option.childrenClass;
    var handleHeaderClick = function () { return handleClick(label); };
    return (React.createElement("div", { style: label === sortParameter ? { color: 'white', width: width } : { width: width }, onClick: handleHeaderClick, className: ("filter_table__header-cell " + (childrenClass || '')).trim() },
        React.createElement("span", { className: "filter_table__header-cell-label" }, header),
        React.createElement("span", { className: "filter_table__header-cell-icon" }, generateSortIcon(sortParameter, label, sortDirection))));
};
exports.default = HeaderColumn;
