"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Created: 2017-05-13 12:52:45 -04:00
 * Author: erik
 */
var immutable_1 = require("immutable");
var React = require("react");
var loader_1 = require("../../loader");
var pie_table_1 = require("../pie_table");
var sample__line_production_1 = require("../sample__line_production/sample__line_production");
var config = [
    { header: 'Date', label: 'date', width: '25%' },
    { header: 'Machine', label: 'line', width: '25%' },
    { header: 'Product', label: 'keyword', width: '25%' },
    { header: 'Weight', label: 'value', width: '25%' },
];
function parseScrapPieData(production) {
    var pieChart = production.reduce(function (map, cur) {
        var product = cur.get('keyword');
        if (map.has(product)) {
            return map.set(product, map.get(product) + parseFloat(cur.get('value')));
        }
        else {
            return map.set(product, parseFloat(cur.get('value')));
        }
    }, immutable_1.Map({}));
    return pieChart.map(function (value, name) { return ({ name: name, value: Math.round(value) }); }).toList();
}
exports.parseScrapPieData = parseScrapPieData;
var SampleLineScrap = function (_a) {
    var departmentDataStore = _a.departmentDataStore, type = _a.type, parent = _a.parent;
    if (!departmentDataStore || !departmentDataStore.get('procScrap')) {
        return React.createElement(loader_1.default, null);
    }
    // get a list of available machines
    var scrap = departmentDataStore.get('procScrap');
    scrap = sample__line_production_1.setMachineInList(scrap, type, parent);
    scrap = sample__line_production_1.formatProduction(scrap);
    // pie chart
    var pieData = parseScrapPieData(scrap);
    return (React.createElement("div", { className: "sample__line_scrap__container" },
        React.createElement(pie_table_1.default, { pieData: pieData, tableData: scrap, tableConfig: config, pieHeader: "Scrap Pounds By Product", tableHeader: "Scrap Generation By Time & Weight" })));
};
exports.default = SampleLineScrap;
