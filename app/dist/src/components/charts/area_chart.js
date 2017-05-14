"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var recharts_1 = require("recharts");
var chart_container_1 = require("./chart_container");
var custom_tick_1 = require("./custom_tick");
var AreaChartComponent = function (props) {
    var chartData = props.chartData, xAxis = props.xAxis, domain = props.domain, lines = props.lines, padding = props.padding, imageTarget = props.imageTarget;
    return (React.createElement(chart_container_1.default, __assign({}, props),
        React.createElement(recharts_1.AreaChart, { data: chartData, margin: { top: 0, right: 0, left: 0, bottom: 35 } },
            React.createElement(recharts_1.XAxis, { dataKey: xAxis, tick: React.createElement(custom_tick_1.default, null), padding: padding }),
            React.createElement(recharts_1.YAxis, { domain: domain }),
            React.createElement(recharts_1.Tooltip, { itemStyle: { color: '#0c1115' }, labelStyle: { color: '#0c1115' } }),
            lines.map(function (line, i) { return React.createElement(recharts_1.Area, __assign({ key: i }, line)); }))));
};
exports.default = AreaChartComponent;
