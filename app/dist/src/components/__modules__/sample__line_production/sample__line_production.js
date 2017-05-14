"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var moment = require("moment");
var React = require("react");
var loader_1 = require("../../loader");
var pie_table_1 = require("../pie_table");
var config = [
    { header: 'Date', label: 'date', width: '25%' },
    { header: 'Machine', label: 'line', width: '25%' },
    { header: 'Product', label: 'keyword', width: '25%' },
    { header: 'Box Weight', label: 'value', width: '25%' },
];
function setMachineInList(list, type, parent) {
    var machines;
    if (type === 'department') {
        machines = parent.machines;
        return list.map(function (p) { return (p.set('line', machines.find(function (m) { return m.id === p.get('machine'); }).name)); });
    }
    else {
        return list.filter(function (p) { return p.get('machine') === parent.id; })
            .map(function (p) { return p.set('line', parent.name); });
    }
}
exports.setMachineInList = setMachineInList;
function formatProduction(list) {
    return list.map(function (p) { return (p.set('date', moment(p.get('created')).format('HH:mm'))
        .set('created', moment(p.get('created')))
        .set('value', p.get('value').toFixed(1))); }).sort(function (a, b) { return a.get('created') > b.get('created') ? 1 : -1; });
}
exports.formatProduction = formatProduction;
function parseProductionPieData(production) {
    var pieChart = production.reduce(function (map, cur) {
        var product = cur.get('keyword');
        if (map.has(product)) {
            return map.set(product, map.get(product).push(cur));
        }
        else {
            return map.set(product, immutable_1.List([cur]));
        }
    }, immutable_1.Map({}));
    return pieChart.map(function (list, name) { return ({ name: name, value: list.size }); }).toList();
}
exports.parseProductionPieData = parseProductionPieData;
var SampleProduction = function (_a) {
    var parent = _a.parent, departmentDataStore = _a.departmentDataStore, type = _a.type;
    if (!departmentDataStore || !departmentDataStore.get('procProduction')) {
        return React.createElement(loader_1.default, null);
    }
    // get a list of available machines
    var production = departmentDataStore.get('procProduction');
    production = setMachineInList(production, type, parent);
    production = formatProduction(production);
    // pie chart
    var pieData = parseProductionPieData(production);
    return (React.createElement("div", { className: "sample__production__container" },
        React.createElement(pie_table_1.default, { pieData: pieData, tableData: production, tableConfig: config, pieHeader: "Boxes By Product", tableHeader: "Product Packaging Time & Weight" })));
};
exports.default = SampleProduction;
