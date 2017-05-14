"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var dom_1 = require("../../utils/dom");
var sort_1 = require("../../utils/sort");
var navbar_dropdown_1 = require("./navbar_dropdown");
var navbar_nav_1 = require("./navbar_nav");
var navbar_neighbor_1 = require("./navbar_neighbor");
var navbar_settings_1 = require("./navbar_settings");
var Navbar = (function (_super) {
    __extends(Navbar, _super);
    function Navbar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            dropdownX: undefined,
            dropdownY: undefined,
            dropdownContainer: undefined,
        };
        _this.hideNeighbors = _this.hideNeighbors.bind(_this);
        return _this;
    }
    Navbar.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.hideNeighbors.bind(this));
    };
    Navbar.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.hideNeighbors.bind(this));
    };
    Navbar.prototype.hideNeighbors = function (e) {
        if (this.state.dropdownContainer) {
            this.setState({
                dropdownX: undefined,
                dropdownY: undefined,
                dropdownContainer: undefined,
            });
        }
    };
    Navbar.prototype.renderNeighbors = function (path, neighbors) {
        var _this = this;
        return neighbors.sort(sort_1.alphaNumSort).map(function (name, i) { return (React.createElement(navbar_neighbor_1.default, { path: path, hide: _this.hideNeighbors, key: i, name: name })); });
    };
    Navbar.prototype.getDropdownMeasurements = function (e, length) {
        var _a = dom_1.default(e), dropdownX = _a.dropdownX, dropdownY = _a.dropdownY, windowWidth = _a.windowWidth;
        var height = length * 40;
        return {
            left: "" + Math.round(windowWidth - dropdownX - 215 <= 0 ? windowWidth - 240 : dropdownX),
            top: "" + Math.round(windowWidth < 970 ? dropdownY + 15 : dropdownY + 10),
            height: "" + (height <= 400 ? height : 400),
        };
    };
    Navbar.prototype.showNeighbors = function (e, neighbors) {
        // hide niehbors if they are currently shown
        if (this.state.dropdownContainer) {
            this.hideNeighbors(e);
            return;
        }
        var path = this.props.path;
        var styles = this.getDropdownMeasurements(e, neighbors.length);
        var _a = dom_1.default(e), dropdownX = _a.dropdownX, dropdownY = _a.dropdownY, windowWidth = _a.windowWidth;
        var dropdownContainer = (React.createElement(navbar_dropdown_1.default, { style: styles, neighbors: this.renderNeighbors(path, neighbors) }));
        this.setState({ dropdownX: dropdownX, dropdownY: dropdownY, dropdownContainer: dropdownContainer });
    };
    Navbar.prototype.renderSiteNav = function (hierarchyTier, last, to, neighbors) {
        var _this = this;
        var handleClick = this.hideNeighbors;
        var active = false;
        if (hierarchyTier.name === last.name) {
            active = true;
            handleClick = function (e) { return _this.showNeighbors(e, neighbors); };
        }
        return React.createElement(navbar_nav_1.default, { to: to, name: hierarchyTier.name, handleClick: handleClick, active: active });
    };
    Navbar.prototype.render = function () {
        var _a = this.props, sites = _a.sites, user = _a.user, hierarchy = _a.hierarchy, config = _a.config;
        var name = !user || !user.username ? '' : user.username;
        var site = hierarchy ? hierarchy.site : undefined;
        var department = hierarchy ? hierarchy.department : undefined;
        var machine = hierarchy ? hierarchy.machine : undefined;
        var last = machine || department || site; // determine depth of hiearchy
        var siteTo = site ? config.baseUrl + "/" + site.code : '';
        var departmentTo = department ? config.baseUrl + "/" + site.code + "/" + department.name : '';
        var machineTo = machine ? config.baseUrl + "/" + site.code + "/" + department.name + "/" + machine.name : '';
        var siteNeighbors = sites ? sites.map(function (s) { return s.code; }) : undefined;
        var departmentNeighbors = site ? site.departments.map(function (dpt) { return dpt.name; }) : undefined;
        var machineNeighbors = department ? department.machines.map(function (mch) { return mch.name; }) : undefined;
        return (React.createElement("header", { className: "navbar__container" },
            this.state.dropdownContainer,
            React.createElement(react_router_1.Link, { to: "/", onClick: this.hideNeighbors },
                React.createElement("div", { className: "navbar__icon-container" },
                    React.createElement("img", { alt: "Logo", className: "nav-bar-logo", src: "https://res.cloudinary.com/dvr87tqip/image/upload/v1486861546/logo_jvidta.png", height: "40px" }))),
            React.createElement(react_router_1.Link, { to: "/", onClick: this.hideNeighbors },
                React.createElement("div", { className: "navbar__app-label" }, config.name)),
            React.createElement("nav", { className: "navbar__hierarchy-container" },
                React.createElement("div", { className: "navbar__hierarchy-item-holder" },
                    React.createElement("div", { className: "navbar__hierarchy-item-child" })),
                site ? this.renderSiteNav(site, last, siteTo, siteNeighbors) : '',
                department ? this.renderSiteNav(department, last, departmentTo, departmentNeighbors) : '',
                machine ? this.renderSiteNav(machine, last, machineTo, machineNeighbors) : ''),
            React.createElement("div", { className: "navbar__info-container" },
                React.createElement("div", { className: "navbar__username" }, name),
                React.createElement("div", { className: "navbar__settings" },
                    React.createElement(navbar_settings_1.default, { admin: "/admin", settings: "/settings", about: "/about", help: "/help" })))));
    };
    return Navbar;
}(React.Component));
exports.default = Navbar;
