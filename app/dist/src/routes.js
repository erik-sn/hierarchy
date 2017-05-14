"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var about_1 = require("./components/about");
var admin_1 = require("./components/admin/admin");
var application_1 = require("./components/application");
var main_1 = require("./components/hierarchy/main/main");
var notfound_1 = require("./components/notfound");
var settings_1 = require("./components/settings");
var department_1 = require("./components/hierarchy/department");
var Routes = (React.createElement(react_router_1.Router, null,
    React.createElement(react_router_1.Route, { path: "/", component: application_1.default },
        React.createElement(react_router_1.IndexRoute, { component: main_1.default }),
        React.createElement(react_router_1.Route, { path: "/admin", component: admin_1.default }),
        React.createElement(react_router_1.Route, { path: "/admin/:menu*", component: admin_1.default }),
        React.createElement(react_router_1.Route, { path: "/settings", component: settings_1.default }),
        React.createElement(react_router_1.Route, { path: "/about", component: about_1.default }),
        React.createElement(react_router_1.Route, { path: "/:site", component: main_1.default }),
        React.createElement(react_router_1.Route, { path: "/:site/:department", component: department_1.default }),
        React.createElement(react_router_1.Route, { path: "/:site/:department/:machine", component: department_1.default }),
        React.createElement(react_router_1.Route, { path: "/:site/:department/m/:module", component: department_1.default }),
        React.createElement(react_router_1.Route, { path: "/:site/:department/:machine/m/:module", component: department_1.default }),
        React.createElement(react_router_1.Route, { path: "*", component: notfound_1.default }))));
exports.default = Routes;
