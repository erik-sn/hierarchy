"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var moment = require("moment");
var React = require("react");
var bar_chart_1 = require("../../charts/bar_chart");
var loader_1 = require("../../loader");
var chartBars = [
    {
        strokeWidth: 1,
        type: 'linear',
        dot: false,
        dataKey: 'First Aid',
        fill: '#73BBD0',
        stroke: 'whitesmoke',
        isAnimationActive: true,
    },
    {
        strokeWidth: 1,
        type: 'linear',
        dot: false,
        dataKey: 'Near Misses',
        fill: '#D3B90A',
        stroke: 'whitesmoke',
        isAnimationActive: true,
    },
    {
        strokeWidth: 1,
        type: 'linear',
        dot: false,
        dataKey: 'Recordables',
        fill: '#EC3439',
        stroke: 'whitesmoke',
        isAnimationActive: true,
    },
];
var Safety = (function (_super) {
    __extends(Safety, _super);
    function Safety() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Safety.prototype.render = function () {
        var _this = this;
        var plotData = this.props.plotData;
        if (!plotData) {
            return React.createElement(loader_1.default, null);
        }
        var formattedData = plotData.map(function (v, k) {
            return __assign({ month: k[0].toUpperCase() + k.slice(1) }, _this.formatKeys(v));
        })
            .toList()
            .toJS()
            .sort(this.monthSort);
        return (React.createElement("div", { className: "safety__container overview__chart" },
            React.createElement("h3", null, "Annual Safety Data"),
            React.createElement(bar_chart_1.default, { xAxis: "month", chartData: formattedData, bars: chartBars, showDownload: true, showImage: true })));
    };
    Safety.prototype.monthSort = function (a, b) {
        return moment(a.month, 'MMM') > moment(b.month, 'MMM') ? 1 : -1;
    };
    Safety.prototype.formatKeys = function (safetyData) {
        return {
            'First Aid': safetyData.get('first_aid'),
            'Near Misses': safetyData.get('near_misses'),
            'Recordables': safetyData.get('recordables'),
        };
    };
    Safety.prototype.shouldComponentUpdate = function (nextProps) {
        return !immutable_1.is(nextProps.plotData, this.props.plotData);
    };
    return Safety;
}(React.Component));
exports.default = Safety;
