"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Created: 2017-05-13 13:29:24 -04:00
 * Author: erik
 */
var immutable_1 = require("immutable");
var React = require("react");
var area_chart_1 = require("../../charts/area_chart");
var bar_chart_1 = require("../../charts/bar_chart");
var loader_1 = require("../../loader");
var chart_options_1 = require("../chart_options");
var stats_1 = require("../stats");
var utils_1 = require("../utils");
var ForgeOverview = function (_a) {
    var departmentDataStore = _a.departmentDataStore, type = _a.type, parent = _a.parent;
    if (!departmentDataStore) {
        return React.createElement(loader_1.default, null);
    }
    var units = departmentDataStore.get('procForgeUnit');
    var uptime = departmentDataStore.get('procForgeUptime');
    var uptimeData = utils_1.parseTimeSeries(type, parent, uptime);
    var unitsWithDate = utils_1.getDateFromCreated(units);
    var barChartData;
    if (type === 'machine') {
        barChartData = unitsWithDate.filter(function (obj) { return obj.get('machine') === parent.id; });
    }
    else {
        var dateMap = utils_1.parseDateMap(type, parent, unitsWithDate);
        barChartData = dateMap.map(function (v, k) { return immutable_1.Map({ date: k, value: stats_1.sum(v) }); }).toList();
    }
    return (React.createElement("div", { className: "forge_overview__container" },
        React.createElement("div", { className: "forge__production" },
            React.createElement("h3", null, "Forge Production"),
            React.createElement(bar_chart_1.default, { xAxis: "date", chartData: barChartData.sort(utils_1.sortByDate).toJS(), bars: [chart_options_1.bar], showDownload: true, showImage: true })),
        React.createElement("div", { className: "forge__uptime" },
            React.createElement("h3", null, "Forge Uptime"),
            React.createElement(area_chart_1.default, { xAxis: "date", chartData: uptimeData.sort(utils_1.sortByDate).toJS(), lines: [chart_options_1.areaLine], fill: "#59A1B6", showDownload: true, showImage: true, imageTarget: "forge__uptime" }))));
};
exports.default = ForgeOverview;
