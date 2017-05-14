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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var recharts_1 = require("recharts");
var renderActiveShape = function (props) {
    var RADIAN = Math.PI / 180;
    var cx = props.cx, cy = props.cy, midAngle = props.midAngle, innerRadius = props.innerRadius, outerRadius = props.outerRadius, startAngle = props.startAngle, endAngle = props.endAngle, fill = props.fill, payload = props.payload, percent = props.percent, value = props.value;
    var sin = Math.sin(-RADIAN * midAngle);
    var cos = Math.cos(-RADIAN * midAngle);
    var sx = cx + (outerRadius + 10) * cos;
    var sy = cy + (outerRadius + 10) * sin;
    var mx = cx + (outerRadius + 30) * cos;
    var my = cy + (outerRadius + 30) * sin;
    var ex = mx + (cos >= 0 ? 1 : -1) * 22;
    var ey = my;
    var textAnchor = cos >= 0 ? 'start' : 'end';
    return (React.createElement("g", null,
        React.createElement("text", { x: cx, y: cy, dy: 8, textAnchor: "middle", fill: fill }, payload.name.toUpperCase()),
        React.createElement(recharts_1.Sector, { cx: cx, cy: cy, innerRadius: innerRadius, outerRadius: outerRadius, startAngle: startAngle, endAngle: endAngle, fill: fill }),
        React.createElement(recharts_1.Sector, { cx: cx, cy: cy, startAngle: startAngle, endAngle: endAngle, innerRadius: outerRadius + 6, outerRadius: outerRadius + 10, fill: fill }),
        React.createElement("path", { d: "M" + sx + "," + sy + "L" + mx + "," + my + "L" + ex + "," + ey, stroke: fill, fill: "none" }),
        React.createElement("circle", { cx: ex, cy: ey, r: 2, fill: fill, stroke: "none" }),
        React.createElement("text", { x: ex + (cos >= 0 ? 1 : -1) * 12, y: ey, textAnchor: textAnchor, fill: "#333" }, value),
        React.createElement("text", { x: ex + (cos >= 0 ? 1 : -1) * 12, y: ey, dy: 18, textAnchor: textAnchor, fill: "#999" }, (percent * 100).toFixed(1) + "%")));
};
var TwoLevelPieChart = (function (_super) {
    __extends(TwoLevelPieChart, _super);
    function TwoLevelPieChart(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            activeIndex: 0,
            activeShape: undefined,
            label: undefined,
        };
        _this.onPieEnter = _this.onPieEnter.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }
    TwoLevelPieChart.prototype.onPieEnter = function (input, index) {
        this.setState({
            activeIndex: index,
        });
    };
    TwoLevelPieChart.prototype.handleClick = function (entry) {
        if (this.props.handleClick) {
            this.props.handleClick(entry);
        }
    };
    TwoLevelPieChart.prototype.render = function () {
        var activeIndex = this.state.activeIndex;
        var _a = this.props, chartData = _a.chartData, height = _a.height, innerRadius = _a.innerRadius, outerRadius = _a.outerRadius, width = _a.width;
        return (React.createElement("div", null,
            React.createElement(recharts_1.PieChart, { width: width || 400, height: height || 315, onMouseEnter: this.onPieEnter },
                React.createElement(recharts_1.Pie, { activeIndex: activeIndex, activeShape: renderActiveShape, data: chartData, innerRadius: innerRadius || 50, outerRadius: outerRadius || 70, onClick: this.handleClick }, chartData.map(function (entry, i) { return React.createElement(recharts_1.Cell, { key: i, fill: entry.color || '#59A1B6' }); })))));
    };
    return TwoLevelPieChart;
}(React.Component));
exports.default = TwoLevelPieChart;
