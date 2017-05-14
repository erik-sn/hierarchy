"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var settings_input_antenna_1 = require("material-ui/svg-icons/action/settings-input-antenna");
var view_module_1 = require("material-ui/svg-icons/action/view-module");
var device_hub_1 = require("material-ui/svg-icons/hardware/device-hub");
var Tabs_1 = require("material-ui/Tabs");
/**
 * Generate a navigational bar that allows the user to navigate to
 * each of the major configuration tools
 */
var AdminTabs = function (_a) {
    var navigate = _a.navigate, value = _a.value;
    var navigateHierarchy = function () { return navigate('hierarchy'); };
    var navigateModules = function () { return navigate('modules'); };
    var navigateApiCalls = function () { return navigate('apicalls'); };
    return (React.createElement(Tabs_1.Tabs, { value: value },
        React.createElement(Tabs_1.Tab, { onClick: navigateHierarchy, className: "admin__menu-tab", icon: React.createElement(device_hub_1.default, null), label: "hierarchy", value: "hierarchy" }),
        React.createElement(Tabs_1.Tab, { onClick: navigateModules, className: "admin__menu-tab", icon: React.createElement(view_module_1.default, null), label: "modules", value: "modules" }),
        React.createElement(Tabs_1.Tab, { onClick: navigateApiCalls, className: "admin__menu-tab", icon: React.createElement(settings_input_antenna_1.default, null), label: "api calls", value: "apicalls" })));
};
exports.default = AdminTabs;
