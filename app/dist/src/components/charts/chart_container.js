"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var recharts_1 = require("recharts");
var csv_generator_1 = require("../csv_generator");
var png_generator_1 = require("../png_generator");
var ChartContainer = function (_a) {
    var chartData = _a.chartData, xAxis = _a.xAxis, showDownload = _a.showDownload, showImage = _a.showImage, children = _a.children, imageTarget = _a.imageTarget;
    var params = [
        { header: 'X-Axis', label: xAxis },
        { header: 'Value', label: 'value' },
    ];
    return (React.createElement("div", { className: "chart__container" },
        React.createElement(recharts_1.ResponsiveContainer, null, children),
        React.createElement("div", { className: "chart__button-container" },
            showDownload ?
                React.createElement(csv_generator_1.default, { customClass: "chart__button", customStyle: { marginRight: '10px' }, data: chartData, fileName: "processworkshop_data", params: params, showTooltip: true })
                : undefined,
            showImage ?
                React.createElement(png_generator_1.default, { customClass: "chart__button", fileName: "processworkshop_plot", target: imageTarget, showTooltip: true })
                : undefined)));
};
exports.default = ChartContainer;
