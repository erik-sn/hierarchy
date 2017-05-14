"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
function cleanModuleFromUrl(url) {
    var moduleIndex = url.indexOf('/m/');
    return moduleIndex > 0 ? url.substring(0, moduleIndex) : url;
}
var Neighbor = function (_a) {
    var path = _a.path, hide = _a.hide, name = _a.name;
    var rootIndex = path ? cleanModuleFromUrl(path).lastIndexOf('/') + 1 : 0;
    var newPath = path ? path.substring(0, rootIndex) + name.toLowerCase() : '';
    return (React.createElement(react_router_1.Link, { to: newPath, onClick: hide },
        React.createElement("div", { className: "host__label-small navbar__neighbor-item" }, name)));
};
exports.default = Neighbor;
