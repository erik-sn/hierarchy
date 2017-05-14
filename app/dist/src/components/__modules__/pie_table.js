"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pie_chart_1 = require("../charts/pie_chart");
var filter_table_1 = require("../utility/filter_table/filter_table");
var PieTable = function (_a) {
    var pieData = _a.pieData, tableData = _a.tableData, tableConfig = _a.tableConfig, pieHeader = _a.pieHeader, tableHeader = _a.tableHeader;
    return (React.createElement("div", { className: "sample__pielist__container" },
        React.createElement("div", { className: "pielist__pie" },
            React.createElement("h3", null, pieHeader),
            React.createElement(pie_chart_1.default, { chartData: pieData.toJS(), height: 400, width: 500, innerRadius: 75, outerRadius: 120 })),
        React.createElement("div", { className: "pielist__table" },
            React.createElement("h3", null, tableHeader),
            React.createElement(filter_table_1.default, { className: "pielist__filter-table", tableData: tableData.toJS(), config: tableConfig, showCsv: true, showFilter: true, showResults: true }))));
};
exports.default = PieTable;
