"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var notfound_1 = require("../../notfound");
var main_department_1 = require("./main_department");
var main_site_1 = require("./main_site");
var Main = function (_a) {
    var hierarchy = _a.hierarchy, sites = _a.sites;
    if (!hierarchy) {
        return React.createElement(notfound_1.default, null);
    }
    if (sites.length === 0) {
        return (React.createElement("div", { className: "main__message" },
            React.createElement("h3", null, "No Sites Have been configured - contact the administrator")));
    }
    var site = hierarchy.site;
    var display;
    if (!site) {
        display = (React.createElement("div", { className: "main__sites" }, sites.map(function (s, i) { return React.createElement(main_site_1.default, { key: i, site: s }); })));
    }
    else {
        display = (React.createElement("div", { className: "main__departments" }, site.departments.map(function (dpt, i) { return React.createElement(main_department_1.default, { key: i, site: site, department: dpt }); })));
    }
    return (React.createElement("div", { className: "main__container" }, display));
};
exports.default = Main;
