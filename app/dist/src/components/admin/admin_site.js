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
var axios = require("axios");
var Card_1 = require("material-ui/Card");
var List_1 = require("material-ui/List");
var Snackbar_1 = require("material-ui/Snackbar");
var settings_1 = require("material-ui/svg-icons/action/settings");
var business_1 = require("material-ui/svg-icons/communication/business");
var router_1 = require("material-ui/svg-icons/hardware/router");
var React = require("react");
var types_1 = require("../../actions/types");
var admin_department_1 = require("./admin_department");
var admin_machine_1 = require("./admin_machine");
var site_form_1 = require("./forms/site_form");
var getConfigName = function (site, splat) {
    var siteCode = site.code.toLowerCase();
    return splat.replace("/" + siteCode, '').replace('/', '');
};
/**
 * Controller component used for handling edit operations on
 * site objects.
 *
 * @class AdminSite
 * @extends {React.Component<IAdminSiteProps, IAdminSiteState>}
 */
var AdminSite = (function (_super) {
    __extends(AdminSite, _super);
    function AdminSite(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            messageText: '',
            messageShow: false,
            apicalls: undefined,
            modules: undefined,
        };
        _this.updateSite = _this.updateSite.bind(_this);
        _this.showMessage = _this.showMessage.bind(_this);
        _this.handleMessageClose = _this.handleMessageClose.bind(_this);
        _this.configClick = _this.configClick.bind(_this);
        _this.departmentClick = _this.departmentClick.bind(_this);
        _this.machineClick = _this.machineClick.bind(_this);
        return _this;
    }
    AdminSite.prototype.componentDidMount = function () {
        this.fetchModules();
        this.fetchApiCalls();
    };
    AdminSite.prototype.fetchModules = function () {
        var _this = this;
        return axios.get(types_1.default.API + "/modules/", types_1.default.API_CONFIG)
            .then(function (response) {
            _this.setState({
                modules: response.data,
            });
        })
            .catch(function (error) {
            // console.error(error);
            _this.showMessage('Error Loading Modules');
        });
    };
    AdminSite.prototype.fetchApiCalls = function () {
        var _this = this;
        return axios.get(types_1.default.API + "/apicalls/", types_1.default.API_CONFIG)
            .then(function (response) { return _this.setState({
            apicalls: response.data,
        }); })
            .catch(function (error) {
            // console.error(error);
            _this.showMessage('Error Loading Api Calls');
        });
    };
    /**
     * Update a site in the database
     *
     * @param {ISite} site
     *
     * @memberOf AdminSite
     */
    AdminSite.prototype.updateSite = function (site) {
        var _this = this;
        var url = types_1.default.API + "/sites/" + site.id + "/";
        axios.put(url, site, types_1.default.API_CONFIG)
            .then(function () { return _this.showMessage("Site Successfully Updated: " + site.name); })
            .then(function () { return _this.props.fetchHierarchy(); })
            .catch(function () { return _this.showMessage("Error Updating Site: " + site.name); });
    };
    /**
     * Show a message to the user in a SnackBar
     *
     * @param {string} messageText - message to show
     *
     * @memberOf AdminSite
     */
    AdminSite.prototype.showMessage = function (messageText) {
        this.setState({ messageShow: true, messageText: messageText });
    };
    /**
     * Close the SnackBar message
     *
     * @memberOf AdminSite
     */
    AdminSite.prototype.handleMessageClose = function () {
        this.setState({ messageShow: false });
    };
    /**
     * Depeniding on the configuration that is passed, render either the
     * Machine admin configuration, Department admin configuration, or the
     * site admin configuration for the specified site.
     *
     * @param {ISite} site - site that contains departments/machines
     * @param {string} config - which menu to render
     * @returns
     *
     * @memberOf AdminSite
     */
    AdminSite.prototype.renderConfig = function (site, config) {
        var _a = this.state, modules = _a.modules, apicalls = _a.apicalls;
        if (!modules || !apicalls) {
            return undefined;
        }
        switch (config) {
            case 'departments':
                return (React.createElement(admin_department_1.default, { site: site, modules: modules, apicalls: apicalls, fetchHierarchy: this.props.fetchHierarchy, message: this.showMessage }));
            case 'machines':
                return (React.createElement(admin_machine_1.default, { site: site, modules: modules, fetchHierarchy: this.props.fetchHierarchy, message: this.showMessage }));
            default:
                return React.createElement(site_form_1.default, { site: site, submitForm: this.updateSite, modules: modules });
        }
    };
    /**
     * Navigate to base site configuration url
     *
     * @memberOf AdminSite
     */
    AdminSite.prototype.configClick = function () {
        this.props.navigate('');
    };
    /**
     * Navigate to department configuration url
     *
     * @memberOf AdminSite
     */
    AdminSite.prototype.departmentClick = function () {
        this.props.navigate('departments');
    };
    /**
     * Navigate to machine configuration url
     *
     * @memberOf AdminSite
     */
    AdminSite.prototype.machineClick = function () {
        this.props.navigate('machines');
    };
    AdminSite.prototype.render = function () {
        var _a = this.props, site = _a.site, splat = _a.splat, navigate = _a.navigate;
        return (React.createElement("div", { className: "admin__site-container" },
            React.createElement("div", { className: "admin__site-sidebar" },
                React.createElement("div", { className: "admin__site-title" },
                    React.createElement(Card_1.CardTitle, { title: site.name + " - " + site.name, subtitle: site.location })),
                React.createElement("div", { className: "admin__site-options" },
                    React.createElement(List_1.List, null,
                        React.createElement(List_1.ListItem, { onClick: this.configClick, primaryText: "Configuration", leftIcon: React.createElement(settings_1.default, null) }),
                        React.createElement(List_1.ListItem, { onClick: this.departmentClick, primaryText: "Departments", leftIcon: React.createElement(business_1.default, null) }),
                        React.createElement(List_1.ListItem, { onClick: this.machineClick, primaryText: "Machines", leftIcon: React.createElement(router_1.default, null) })))),
            React.createElement("div", { className: "admin__site-content admin__site-content-" + getConfigName(site, splat) }, this.renderConfig(site, getConfigName(site, splat))),
            React.createElement(Snackbar_1.default, { open: this.state.messageShow, message: this.state.messageText, action: "Ok", autoHideDuration: 10000, onActionTouchTap: this.handleMessageClose, onRequestClose: this.handleMessageClose })));
    };
    return AdminSite;
}(React.Component));
exports.default = AdminSite;
