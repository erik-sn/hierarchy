"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var Nav = function (_a) {
    var active = _a.active, to = _a.to, name = _a.name, handleClick = _a.handleClick;
    var lastClass = active ? 'navbar__hierarchy-item-last' : '';
    var handleNavigate = function () { return react_router_1.browserHistory.push(to.toLowerCase()); };
    return (React.createElement("div", { className: "navbar__hierarchy-item-parent", onClick: handleClick },
        React.createElement("div", { className: "navbar__chain-container" }),
        React.createElement("div", { onClick: active ? undefined : handleNavigate, className: "navbar__hierarchy-item-child " + lastClass }, name)));
};
exports.default = Nav;
