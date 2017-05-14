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
var List_1 = require("material-ui/List");
var MenuItem_1 = require("material-ui/MenuItem");
var SelectField_1 = require("material-ui/SelectField");
var close_1 = require("material-ui/svg-icons/navigation/close");
var React = require("react");
/**
 * This component represents an interface that allows the user to
 * add or remove existing api calls to a parent component. It is
 * designed to be generic in its implementation so any HierarchyTier
 * could potentially use it.
 *
 * @class ApiEdit
 * @extends {React.Component<IApiEditProps, IApiEditState>}
 */
var ApiEdit = (function (_super) {
    __extends(ApiEdit, _super);
    function ApiEdit(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            apiCalls: props.department.apiCalls,
        };
        return _this;
    }
    /**
     * set the starting value of the parent's apicalls object as the List
     * of primary keys of every api call
     */
    ApiEdit.prototype.componentWillMount = function () {
        var apiCallIds = this.props.department.apiCalls.map(function (call) { return call.id; });
        this.props.change('apiCalls', apiCallIds);
    };
    /**
     * Add an API call to the list.
     *
     * @param {IApiCall} apiCall - apiCall we are adding
     * @returns {void}
     *
     * @memberOf ApiEdit
     */
    ApiEdit.prototype.handleAddApiCall = function (apiCall) {
        // filter any api calls with the same id as the one we are adding to avoid duplicates
        var apiCalls = this.state.apiCalls.filter(function (api) { return api.id !== apiCall.id; });
        apiCalls.push(apiCall); // then add the new one
        this.updateForm(apiCalls);
    };
    /**
     * Delete an API call from the list
     *
     * @param {IApiCall} apicall - api call we are deleting
     * @returns {void}
     *
     * @memberOf ApiEdit
     */
    ApiEdit.prototype.handleDeleteApiCall = function (apiCall) {
        var apiCalls = this.state.apiCalls.filter(function (call) { return call.id !== apiCall.id; });
        this.updateForm(apiCalls);
    };
    /**
     * Update the parent's form using the change function that
     * was passed to this component. The change function is a
     * redux-form specific function
     *
     * @param {IApiCall[]} apiCalls - list of api calls to update
     *
     * @memberOf ApiEdit
     */
    ApiEdit.prototype.updateForm = function (apiCalls) {
        var _this = this;
        // we store as integers for Django API endpoint
        var apiCallIds = apiCalls.map(function (api) { return api.id; });
        this.setState({ apiCalls: apiCalls }, function () { return _this.props.change('apiCalls', apiCallIds); });
    };
    /**
     * Generate a list of MenuIems that will go into the list of api calls
     * that belong to the parent.
     *
     * @param {IApiCall[]} apiCalls - parent's apiCalls
     * @returns {JSX.Element[]}
     *
     * @memberOf ApiEdit
     */
    ApiEdit.prototype.renderApiCallList = function (apiCalls) {
        var _this = this;
        return apiCalls.map(function (apiCall, i) {
            var handleCloseClick = function () { return _this.handleDeleteApiCall(apiCall); };
            return (React.createElement(MenuItem_1.default, { key: i, value: apiCall.key, primaryText: apiCall.key, rightIcon: React.createElement(close_1.default, { onClick: handleCloseClick }) }));
        });
    };
    /**
     * Generate a list of MenuItems that will go into the select field
     * that lists available ApiCalls.
     *
     * @returns {JSX.Element[]}
     *
     * @memberOf ApiEdit
     */
    ApiEdit.prototype.renderApiCallSelectItems = function () {
        var _this = this;
        return this.props.apiCalls.map(function (apiCall, i) {
            var handleMenuClick = function () { return _this.handleAddApiCall(apiCall); };
            return (React.createElement(MenuItem_1.default, { key: i, value: apiCall.key, primaryText: apiCall.key, onClick: handleMenuClick }));
        });
    };
    ApiEdit.prototype.render = function () {
        var apiCalls = this.state.apiCalls;
        return (React.createElement("div", { className: "admin__apicall-edit" },
            React.createElement("h3", null, "API Calls"),
            React.createElement(List_1.List, null,
                apiCalls && apiCalls.length === 0 ? React.createElement("div", { className: "admin__message" }, "No API Calls") : '',
                this.renderApiCallList(apiCalls)),
            React.createElement(SelectField_1.default, { style: { width: '100%' }, hintText: "Add Api Call", maxHeight: 300 }, this.props.apiCalls ? this.renderApiCallSelectItems() : undefined)));
    };
    return ApiEdit;
}(React.Component));
exports.default = ApiEdit;
