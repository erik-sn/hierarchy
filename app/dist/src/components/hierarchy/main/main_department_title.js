"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var keyboard_arrow_right_1 = require("material-ui/svg-icons/hardware/keyboard-arrow-right");
var React = require("react");
var react_router_1 = require("react-router");
exports.DepartmentTitle = function (_a) {
    var name = _a.name, url = _a.url;
    return (React.createElement(react_router_1.Link, { to: url.toLowerCase() },
        React.createElement("div", { className: "main__department-title" },
            React.createElement("div", { className: "main__department-title-icon" },
                React.createElement(keyboard_arrow_right_1.default, { style: { height: '35px', width: '35px', color: 'whitesmoke' } })),
            React.createElement("div", { className: "main__department-title-label" }, "" + name))));
};
exports.default = exports.DepartmentTitle;
