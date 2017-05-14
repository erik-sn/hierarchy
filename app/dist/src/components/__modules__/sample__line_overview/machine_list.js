"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var appConfig = require('../../../../appconfig.json');
var MachineList = function (_a) {
    var machines = _a.machines;
    var baseUrl = window.location.pathname.replace(appConfig.baseUrl, '');
    return (React.createElement("div", { className: "overview__machines" },
        React.createElement("div", { className: "overview__machines-header" },
            React.createElement("h3", null, "Machine List")),
        React.createElement("div", { className: "line_overview__machines" }, machines.map(function (m, i) { return React.createElement(react_router_1.Link, { key: i, to: baseUrl + "/" + m.name + "/" }, m.name); }))));
};
exports.default = MachineList;
