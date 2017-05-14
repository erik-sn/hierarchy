"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clear_all_1 = require("material-ui/svg-icons/communication/clear-all");
var filter_list_1 = require("material-ui/svg-icons/content/filter-list");
var React = require("react");
var FilterToggle = function (_a) {
    var handleClick = _a.handleClick, filterAny = _a.filterAny;
    return (React.createElement("div", { className: "filter_table__mode-container", onClick: handleClick },
        React.createElement("div", { className: "tooltip" }, "Toggle Filter Mode"),
        filterAny ? React.createElement(clear_all_1.default, null) : React.createElement(filter_list_1.default, null)));
};
exports.default = FilterToggle;
