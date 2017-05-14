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
var immutable_1 = require("immutable");
var React = require("react");
var bar_chart_1 = require("../../charts/bar_chart");
var loader_1 = require("../../loader");
var chartBars = [
    {
        strokeWidth: 1,
        type: 'linear',
        dot: false,
        dataKey: 'Production Pounds',
        fill: '#73BBD0',
        stroke: 'whitesmoke',
        isAnimationActive: true,
    },
];
var Waste = (function (_super) {
    __extends(Waste, _super);
    function Waste() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Waste.prototype.render = function () {
        var _a = this.props, production = _a.production, scrap = _a.scrap;
        if (!production || !scrap) {
            return React.createElement(loader_1.default, null);
        }
        var productionMap = this.sumByProduct(production);
        var scrapMap = this.sumByProduct(scrap);
        var wasteMap = scrapMap
            .mergeWith(this.mergeScrapWithProduction, productionMap)
            .map(function (v, k) { return ({ 'Product': k, 'Percent Waste': v.toFixed(1) }); })
            .toList()
            .toJS()
            .sort(this.sortWasteForPareto);
        return (React.createElement("div", { className: "waste_container overview__chart" },
            React.createElement("h3", null, "Waste Percent By Product"),
            React.createElement(bar_chart_1.default, { xAxis: "Product", chartData: wasteMap, bars: chartBars, domain: [0, 8], showDownload: true, showImage: true })));
    };
    Waste.prototype.mergeScrapWithProduction = function (scrap, production) {
        return 100 * scrap / production;
    };
    Waste.prototype.sortWasteForPareto = function (a, b) {
        return parseFloat(a['Percent Waste']) < parseFloat(b['Percent Waste']) ? 1 : -1;
    };
    Waste.prototype.sumByProduct = function (production) {
        return production.reduce(function (map, cur) {
            var product = cur.get('keyword');
            if (map.has(product)) {
                return map.set(product, map.get(product) + cur.get('value'));
            }
            else {
                return map.set(product, cur.get('value'));
            }
        }, immutable_1.Map());
    };
    Waste.prototype.shouldComponentUpdate = function (nextProps) {
        return !immutable_1.is(nextProps.production, this.props.production) ||
            !immutable_1.is(nextProps.scrap, this.props.scrap);
    };
    return Waste;
}(React.Component));
exports.default = Waste;
