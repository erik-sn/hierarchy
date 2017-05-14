"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
exports.MainSite = function (_a) {
    var site = _a.site;
    return (React.createElement(react_router_1.Link, { className: "main__site-container host__label-large", to: "/" + site.code.toLowerCase() },
        React.createElement("div", { className: "main__site-title" }, site.name + " - " + site.code),
        React.createElement("div", { className: "main__site-subtitle" }, site.location),
        React.createElement("div", { className: "main__site-departmentcount" },
            "Departments: ",
            site.departments.length)));
};
exports.default = exports.MainSite;
