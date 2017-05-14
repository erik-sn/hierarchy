"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IconButton_1 = require("material-ui/IconButton");
var IconMenu_1 = require("material-ui/IconMenu");
var MenuItem_1 = require("material-ui/MenuItem");
var help_outline_1 = require("material-ui/svg-icons/action/help-outline");
var info_outline_1 = require("material-ui/svg-icons/action/info-outline");
var settings_1 = require("material-ui/svg-icons/action/settings");
var security_1 = require("material-ui/svg-icons/hardware/security");
var more_vert_1 = require("material-ui/svg-icons/navigation/more-vert");
var React = require("react");
var react_router_1 = require("react-router");
var toSettings = function () { return react_router_1.browserHistory.push('settings'); };
var toAdmin = function () { return react_router_1.browserHistory.push('admin'); };
var toHelp = function () { return react_router_1.browserHistory.push('help'); };
var toAbout = function () { return react_router_1.browserHistory.push('about'); };
var Settings = function (_a) {
    var settings = _a.settings, admin = _a.admin, help = _a.help, about = _a.about;
    return (React.createElement(IconMenu_1.default, { iconButtonElement: React.createElement(IconButton_1.default, null,
            React.createElement(more_vert_1.default, { color: "whitesmoke" })), targetOrigin: { horizontal: 'right', vertical: 'top' }, anchorOrigin: { horizontal: 'right', vertical: 'top' } },
        React.createElement(MenuItem_1.default, { onClick: toSettings, primaryText: "Settings", leftIcon: React.createElement(settings_1.default, null) }),
        React.createElement(MenuItem_1.default, { onClick: toAdmin, primaryText: "Admin", leftIcon: React.createElement(security_1.default, null) }),
        React.createElement(MenuItem_1.default, { onClick: toHelp, primaryText: "Help", leftIcon: React.createElement(help_outline_1.default, null) }),
        React.createElement(MenuItem_1.default, { onClick: toAbout, primaryText: "About", leftIcon: React.createElement(info_outline_1.default, null) })));
};
exports.default = Settings;
