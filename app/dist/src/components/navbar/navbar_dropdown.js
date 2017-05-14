"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Dropdown = function (_a) {
    var style = _a.style, neighbors = _a.neighbors;
    return (React.createElement("div", { className: "navbar__neighbor-container", style: style },
        React.createElement("div", { className: "navbar__neighbor-list" }, neighbors)));
};
exports.default = Dropdown;
