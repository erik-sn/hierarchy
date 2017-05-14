"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var area_chart_1 = require("../../charts/area_chart");
var loader_1 = require("../../loader");
var chart_options_1 = require("../chart_options");
var stats_1 = require("../stats");
var utils_1 = require("../utils");
var SampleLineEfficiency = function (_a) {
    var parent = _a.parent, type = _a.type, departmentDataStore = _a.departmentDataStore;
    if (!departmentDataStore) {
        return React.createElement(loader_1.default, null);
    }
    var rawEfficiency = departmentDataStore.get('procEfficiency');
    var efficiency = utils_1.parseTimeSeries(type, parent, rawEfficiency);
    var _b = stats_1.computeStats(efficiency, 'value'), count = _b.count, avg = _b.avg, stdev = _b.stdev;
    return (React.createElement("div", { className: "sample__line_efficiency__container" },
        React.createElement("div", { className: "sample__line_efficiency-stats" },
            React.createElement("div", null,
                "Count: ",
                React.createElement("span", null, count)),
            React.createElement("div", null,
                "Average: ",
                React.createElement("span", null,
                    avg.toFixed(2),
                    "%")),
            React.createElement("div", null,
                "Standard Deviation: ",
                React.createElement("span", null,
                    stdev.toFixed(2),
                    "%"))),
        React.createElement("div", { className: "sample__line_efficiency-chart" },
            React.createElement(area_chart_1.default, { xAxis: "date", chartData: efficiency.toJS(), lines: [chart_options_1.areaLine], fill: "#59A1B6", showDownload: true, showImage: true, imageTarget: "sample__line_efficiency-chart" }))));
};
exports.default = SampleLineEfficiency;
