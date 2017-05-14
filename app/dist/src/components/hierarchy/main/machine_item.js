"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var MachineItem = function (_a) {
    var name = _a.name, url = _a.url;
    return (React.createElement(react_router_1.Link, { className: "main__machine-item host__label-small", to: (url + "/" + name).toLowerCase() },
        React.createElement("div", { className: "main__machine-item-label" }, name)));
};
exports.default = MachineItem;
