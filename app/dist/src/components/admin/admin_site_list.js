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
var FlatButton_1 = require("material-ui/FlatButton");
var List_1 = require("material-ui/List");
var add_1 = require("material-ui/svg-icons/content/add");
var React = require("react");
var types_1 = require("../../actions/types");
var modal_1 = require("../modal");
var site_form_1 = require("./forms/site_form");
/**
 * Component that lists available sites and allows for creation of new sites
 *
 * @class AdminSiteList
 * @extends {React.Component<IAdminSiteListProps, IAdminSiteListState>}
 */
var AdminSiteList = (function (_super) {
    __extends(AdminSiteList, _super);
    function AdminSiteList(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            showNewForm: false,
            messageText: '',
            messageShow: false,
        };
        _this.toggleShowNewSiteForm = _this.toggleShowNewSiteForm.bind(_this);
        _this.createSite = _this.createSite.bind(_this);
        return _this;
    }
    /**
     * Toggle the showNewForm state which controls the creation forms
     * inside a modal
     *
     * @memberOf AdminSiteList
     */
    AdminSiteList.prototype.toggleShowNewSiteForm = function () {
        this.setState({ showNewForm: !this.state.showNewForm });
    };
    /**
     * Create a site in the database
     *
     * @param {ISite} site - site object to be created
     *
     * @memberOf AdminSiteList
     */
    AdminSiteList.prototype.createSite = function (site) {
        var _this = this;
        axios.post(types_1.default.API + "/sites/", site, types_1.default.API_CONFIG)
            .then(function () { return _this.setState({
            messageShow: true,
            messageText: "Site Successfully Created: " + site.name,
        }); })
            .then(function () { return _this.props.fetchHierarchy(); })
            .catch(function () { return _this.setState({
            messageShow: true,
            messageText: "Error Creating Site: " + site.name,
        }); });
        this.toggleShowNewSiteForm();
    };
    /**
     * Render a clean site form inside a Modal
     *
     * @returns {JSX.Element}
     *
     * @memberOf AdminSiteList
     */
    AdminSiteList.prototype.renderNewSiteModal = function () {
        return (React.createElement(modal_1.default, { title: "Create New Site", onCancel: this.toggleShowNewSiteForm },
            React.createElement(site_form_1.default, { submitForm: this.createSite })));
    };
    /**
     * Render a list of ListItems, each representing a site
     * object
     *
     * @returns {JSX.Element[]}
     *
     * @memberOf AdminSiteList
     */
    AdminSiteList.prototype.renderSiteList = function () {
        var _this = this;
        return this.props.sites.map(function (site, i) {
            var handleSiteClick = function () { return _this.props.navigate(site.code); };
            return (React.createElement(List_1.ListItem, { key: i, onClick: handleSiteClick, primaryText: site.name + " - " + site.code, secondaryText: site.location }));
        });
    };
    AdminSiteList.prototype.render = function () {
        var sites = this.props.sites;
        return (React.createElement("div", { className: "admin__site-list-container" },
            this.state.showNewForm ? this.renderNewSiteModal() : undefined,
            React.createElement(List_1.List, null,
                this.renderSiteList(),
                React.createElement(FlatButton_1.default, { onClick: this.toggleShowNewSiteForm, label: "Add Site", icon: React.createElement(add_1.default, null), primary: true }))));
    };
    return AdminSiteList;
}(React.Component));
exports.default = AdminSiteList;
