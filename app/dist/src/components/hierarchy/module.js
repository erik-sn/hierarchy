"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var appConfig = require('../../../appconfig.json');
function getUrl() {
    var url = window.location.pathname.replace(/\/+$/, '').replace(appConfig.baseUrl, '');
    return url.indexOf('/m/') > 0 ? url.substring(0, url.indexOf('/m/')) : url;
}
var Module = function (_a) {
    var activeModule = _a.activeModule, module = _a.module, setActive = _a.setActive, hierarchyObject = _a.hierarchyObject;
    var url = getUrl();
    var isActive = activeModule && activeModule.name === module.name;
    var isDefault = hierarchyObject.defaultModule && module.id === hierarchyObject.defaultModule.id;
    var handleClick = function () { return setActive(module); };
    return (React.createElement(react_router_1.Link, { to: isDefault ? url : (url + "/m/" + module.label).toLowerCase() },
        React.createElement("div", { className: "display__module-item " + (isActive ? 'host__tab-selected' : 'host__tab'), onClick: handleClick },
            module.description ?
                React.createElement("div", { className: "display__module-item-tooltip tooltip" }, module.description)
                : undefined,
            module.label)));
};
exports.default = Module;
