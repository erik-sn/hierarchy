"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
exports.NotFound = function () { return (React.createElement("div", { className: "notfound__container" },
    React.createElement("h2", null, "URL Not Found"),
    React.createElement("h4", null,
        React.createElement(react_router_1.Link, { to: "/" }, "Click Here to Return to Site Page")))); };
exports.default = exports.NotFound;
