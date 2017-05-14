"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Card_1 = require("material-ui/Card");
var React = require("react");
var sort_1 = require("../../../utils/sort");
var machine_item_1 = require("./machine_item");
var MachineContainer = function (_a) {
    var department = _a.department, url = _a.url;
    var sortedMachines = department.machines.map(function (mch) { return mch.name; }).sort(sort_1.alphaNumSort);
    return (React.createElement(Card_1.CardText, { style: { padding: '0px' } },
        React.createElement("div", { className: "main__machine-container" }, sortedMachines.map(function (mch, j) { return React.createElement(machine_item_1.default, { key: j, name: mch, url: url }); }))));
};
exports.default = MachineContainer;
