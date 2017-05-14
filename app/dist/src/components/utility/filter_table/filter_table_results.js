"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Results = function (_a) {
    var ratio = _a.ratio, percent = _a.percent;
    return (React.createElement("div", { className: "filter_table__results-container" }, "Displaying " + ratio + " rows - " + percent + "%"));
};
exports.default = Results;
