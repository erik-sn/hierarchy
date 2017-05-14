"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var React = require("react");
var appConfig = require('../../../../appconfig.json');
var csv_generator_1 = require("../../csv_generator");
var TableCsv = function (_a) {
    var tableData = _a.tableData, tableHeaders = _a.tableHeaders;
    return (React.createElement("div", { className: "filter_table__csv-container" },
        React.createElement(csv_generator_1.default, { fileName: appConfig.name + "_" + moment().format('MMDDYY-HHmm'), data: tableData, params: tableHeaders, showTooltip: true })));
};
exports.default = TableCsv;
