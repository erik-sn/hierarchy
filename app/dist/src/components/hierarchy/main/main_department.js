"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Card_1 = require("material-ui/Card");
var React = require("react");
var machine_container_1 = require("./machine_container");
var main_department_title_1 = require("./main_department_title");
exports.MainDepartment = function (_a) {
    var site = _a.site, department = _a.department;
    var url = "/" + site.code + "/" + department.name;
    return (React.createElement(Card_1.Card, { className: "main__department-container" },
        React.createElement(Card_1.CardHeader, { title: React.createElement(main_department_title_1.default, { url: url, name: department.name }), className: "main__department-title-container", actAsExpander: true, showExpandableButton: true }),
        React.createElement(Card_1.CardText, { style: { padding: '0px' }, expandable: true },
            React.createElement(machine_container_1.default, { url: url, department: department }))));
};
exports.default = exports.MainDepartment;
