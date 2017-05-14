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
var List_1 = require("material-ui/List");
var Snackbar_1 = require("material-ui/Snackbar");
var add_1 = require("material-ui/svg-icons/content/add");
var TextField_1 = require("material-ui/TextField");
var React = require("react");
var react_redux_1 = require("react-redux");
var types_1 = require("../../actions/types");
var loader_1 = require("../loader");
var modal_1 = require("../modal");
var api_form_1 = require("./forms/api_form");
/**
 * Controller component that handles operations on ApiCall objects
 *
 * @export
 * @class ApiCallAdmin
 * @extends {React.Component<IApiCallsProps, IApiCallsState>}
 */
var ApiCallAdmin = (function (_super) {
    __extends(ApiCallAdmin, _super);
    function ApiCallAdmin(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            apiCalls: undefined,
            activeApiCall: undefined,
            messageText: '',
            messageShow: false,
            filter: '',
            showNewForm: false,
        };
        _this.createApiCall = _this.createApiCall.bind(_this);
        _this.updateApiCall = _this.updateApiCall.bind(_this);
        _this.deleteApiCall = _this.deleteApiCall.bind(_this);
        _this.resetState = _this.resetState.bind(_this);
        _this.showMessage = _this.showMessage.bind(_this);
        _this.handleMessageClose = _this.handleMessageClose.bind(_this);
        _this.handleFilterChange = _this.handleFilterChange.bind(_this);
        _this.fetchApiCalls = _this.fetchApiCalls.bind(_this);
        _this.toggleShowNewForm = _this.toggleShowNewForm.bind(_this);
        return _this;
    }
    ApiCallAdmin.prototype.componentDidMount = function () {
        this.fetchApiCalls();
    };
    /**
     * Retrieve all api calls from the database
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.fetchApiCalls = function () {
        var _this = this;
        axios.get(types_1.default.API + "/apicalls/?inactive=true", types_1.default.API_CONFIG)
            .then(function (response) {
            _this.setState({ apiCalls: response.data });
        });
    };
    /**
     * Add an Api Call to the database
     *
     * @param {IApiCall} apiCall - object to be added
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.createApiCall = function (apiCall) {
        var _this = this;
        axios.post(types_1.default.API + "/apicalls/", apiCall, types_1.default.API_CONFIG)
            .then(function () { return _this.fetchApiCalls(); })
            .then(function () { return _this.showMessage("API call Successfully Created: " + apiCall.key); })
            .catch(function () { return _this.showMessage("Error Creating API call: " + apiCall.key); })
            .then(function () { return _this.resetState(); });
    };
    /**
     * Update an Api Call in the database
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.updateApiCall = function () {
        var _this = this;
        var apiCallForm = this.props.apiCall;
        axios.put(types_1.default.API + "/apicalls/" + this.state.activeApiCall.id + "/", apiCallForm, types_1.default.API_CONFIG)
            .then(function () { return _this.fetchApiCalls(); })
            .then(function () { return _this.showMessage("API call Successfully Updated: " + apiCallForm.key); })
            .catch(function () { return _this.showMessage("Error Updating API call: " + apiCallForm.key); })
            .then(function () { return _this.resetState(); });
    };
    /**
     * Delete an Api Call from the database
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.deleteApiCall = function () {
        var _this = this;
        axios.delete(types_1.default.API + "/apicalls/" + this.state.activeApiCall.id + "/", types_1.default.API_CONFIG)
            .then(function () { return _this.fetchApiCalls(); })
            .then(function () { return _this.showMessage("API call Successfully Deleted: " + _this.state.activeApiCall.key); })
            .catch(function () { return _this.showMessage("Error Deleting API call: " + _this.state.activeApiCall.key); })
            .then(function () { return _this.resetState(); });
    };
    /**
     * Set the controller back to a default state
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.resetState = function () {
        this.setState({
            activeApiCall: undefined,
            showNewForm: false,
        });
    };
    /**
     * Show a message to the user using the snackbar component
     *
     * @param {string} messageText - message to show
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.showMessage = function (messageText) {
        this.setState({
            messageShow: true,
            messageText: messageText,
        });
    };
    /**
     * Close the message Snackbar
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.handleMessageClose = function () {
        this.setState({ messageShow: false });
    };
    /**
     * Toggle the state of showNewForm which controls whether
     * or not the Modal containing an ApiForm is rendered
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.toggleShowNewForm = function () {
        this.setState({
            activeApiCall: undefined,
            showNewForm: !this.state.showNewForm,
        });
    };
    /**
     * Set the state of the filter based on user input
     *
     * @param {React.FormEvent<HTMLInputElement>} event
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.handleFilterChange = function (event) {
        this.setState({
            filter: event.currentTarget.value,
        });
    };
    /**
     * Render the update form. This form has the activeApiCall
     * passed as props which will conver the form to be in edit
     * and delete mode rather than create.
     *
     * @returns {JSX.Element}
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.renderApiCallForm = function () {
        return (React.createElement(api_form_1.default, { apiCall: this.state.activeApiCall, submitForm: this.updateApiCall, remove: this.deleteApiCall, cancel: this.resetState }));
    };
    /**
     * Render the create form. This form will be rendered inside
     * a modal and have only the create operation.
     *
     * @returns {JSX.Element}
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.renderNewApiCallForm = function () {
        return (React.createElement(modal_1.default, { title: "Create New API Call", onCancel: this.toggleShowNewForm },
            React.createElement(api_form_1.default, { submitForm: this.createApiCall })));
    };
    /**
     * Filter listed api calls based on user input in the
     * filter box.
     *
     * @returns {IApiCall[]}
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.filteredApiCalls = function () {
        var _a = this.state, apiCalls = _a.apiCalls, filter = _a.filter;
        if (filter.trim()) {
            return apiCalls.filter(function (call) { return (call.key.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
                call.url.toLowerCase().indexOf(filter.toLowerCase()) > -1); });
        }
        return apiCalls;
    };
    /**
     * Generate a list of ListItems that contain the
     *
     * @returns {JSX.Element[]}
     *
     * @memberOf ApiCallAdmin
     */
    ApiCallAdmin.prototype.generateApiCalls = function () {
        var _this = this;
        return this.filteredApiCalls().map(function (apiCall, i) {
            var apiItemClick = function () { return _this.setState({ activeApiCall: apiCall }); };
            return (React.createElement(List_1.ListItem, { key: i, onClick: apiItemClick, primaryText: apiCall.key, secondaryText: apiCall.url }));
        });
    };
    ApiCallAdmin.prototype.render = function () {
        var _a = this.state, apiCalls = _a.apiCalls, showNewForm = _a.showNewForm, activeApiCall = _a.activeApiCall;
        if (!apiCalls) {
            return (React.createElement("div", { className: "admin__apicalls" },
                React.createElement(loader_1.default, null)));
        }
        return (React.createElement("div", { className: "admin__apicalls" },
            showNewForm ? this.renderNewApiCallForm() : undefined,
            React.createElement("div", { className: "admin__apicalls-inner-container" },
                React.createElement("div", { className: "admin__apicalls-list-container" },
                    React.createElement(TextField_1.default, { id: "admin__apicalls-filter", hintText: "API Call Filter", value: this.state.filter, onChange: this.handleFilterChange }),
                    React.createElement(List_1.List, { style: { maxHeight: '400px', overflowY: 'auto' } }, this.generateApiCalls()),
                    React.createElement("div", { className: "admin__modules-new-module-container", onClick: this.toggleShowNewForm },
                        React.createElement(add_1.default, null),
                        React.createElement("span", null, "New API Call"))),
                React.createElement("div", { className: "admin__apicalls-form-container" }, activeApiCall ? this.renderApiCallForm() : React.createElement("h3", null, "Select an API Call"))),
            React.createElement(Snackbar_1.default, { open: this.state.messageShow, message: this.state.messageText, action: "Ok", autoHideDuration: 10000, onActionTouchTap: this.handleMessageClose, onRequestClose: this.handleMessageClose })));
    };
    return ApiCallAdmin;
}(React.Component));
exports.ApiCallAdmin = ApiCallAdmin;
/**
 * Initialize the  form values
 *
 * @param {IReduxState} state
 * @returns {*}
 */
function mapStateToProps(state) {
    if (!state.form[api_form_1.FORM_NAME]) {
        return { apiCallForm: {} };
    }
    return {
        apiCallForm: state.form[api_form_1.FORM_NAME].values || {},
    };
}
exports.default = react_redux_1.connect(mapStateToProps)(ApiCallAdmin);
