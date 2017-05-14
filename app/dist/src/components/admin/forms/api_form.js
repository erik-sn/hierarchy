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
var FlatButton_1 = require("material-ui/FlatButton");
var React = require("react");
var react_redux_1 = require("react-redux");
var redux_form_1 = require("redux-form");
var form_renderer_1 = require("../../../utils/form_renderer");
exports.FORM_NAME = 'API-CONFIG';
/**
 * Form component that handles CRUD operations on API calls
 *
 * @export
 * @class ApiForm
 * @extends {React.Component<IApiFormProps, {}>}
 */
var ApiForm = (function (_super) {
    __extends(ApiForm, _super);
    function ApiForm(props) {
        var _this = _super.call(this, props) || this;
        _this.handleDelete = _this.handleDelete.bind(_this);
        _this.handleCancel = _this.handleCancel.bind(_this);
        _this.clearForm = _this.clearForm.bind(_this);
        return _this;
    }
    ApiForm.prototype.componentWillMount = function () {
        this.props.reset(); // for initializing form
    };
    /**
     * When the component receives a new set of props check to see
     * if it contains a different ApiCall. If so, set that api call
     * into the form.
     *
     * @param {IApiFormProps} nextProps
     *
     * @memberOf ApiForm
     */
    ApiForm.prototype.componentWillReceiveProps = function (nextProps) {
        var change = nextProps.change, apiCall = nextProps.apiCall;
        if ((apiCall && !this.props.apiCall) || (apiCall && apiCall.id !== this.props.apiCall.id)) {
            change('id', apiCall.id);
            change('url', apiCall.url);
            change('key', apiCall.key);
            change('description', apiCall.description);
            change('active', apiCall.active);
        }
    };
    /**
     * handle actions for when the delete button is clicked
     *
     * @memberOf ApiForm
     */
    ApiForm.prototype.handleDelete = function () {
        this.props.remove();
        this.props.reset();
    };
    /**
     * handle actions for when the cancel button is clicked
     *
     * @memberOf ApiForm
     */
    ApiForm.prototype.handleCancel = function () {
        this.props.cancel();
        this.props.reset();
    };
    /**
     * handle action when the clear button is clicked. into
     * this case we use the redux-form function change to
     * set all fields back to their defaults
     *
     * @memberOf ApiForm
     */
    ApiForm.prototype.clearForm = function () {
        var change = this.props.change;
        change('key', '');
        change('description', '');
        change('url', '');
        change('active', true);
    };
    /**
     * Render buttons associated with a new form
     *
     * @returns {JSX.Element}
     *
     * @memberOf ApiForm
     */
    ApiForm.prototype.renderNewFormButtons = function () {
        return (React.createElement(FlatButton_1.default, { key: 4, type: "submit", label: "Submit", primary: true }));
    };
    /**
     * Render buttons associated with updating an Api Call
     *
     * @returns {JSX.Element}
     *
     * @memberOf ApiForm
     */
    ApiForm.prototype.renderUpdateFormButtons = function () {
        return (React.createElement("div", null,
            React.createElement(FlatButton_1.default, { key: 2, onClick: this.handleDelete, label: "Delete", primary: true }),
            React.createElement(FlatButton_1.default, { key: 1, type: "submit", label: "Update", primary: true })));
    };
    ApiForm.prototype.render = function () {
        var _a = this.props, apiCall = _a.apiCall, submitForm = _a.submitForm, handleSubmit = _a.handleSubmit, remove = _a.remove, reset = _a.reset, submitFailed = _a.submitFailed;
        return (React.createElement("form", { onSubmit: handleSubmit(submitForm), className: "admin__form-container" },
            React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "key", component: form_renderer_1.renderTextField, label: "Key" }),
            React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "description", component: form_renderer_1.renderTextField, label: "Description" }),
            React.createElement("div", { style: { width: '100%' } },
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "url", component: form_renderer_1.renderTextField, label: "Url" })),
            React.createElement("div", { style: { width: '100%', height: '20px' } }),
            React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "active", type: "checkbox", component: form_renderer_1.RenderCheckbox, label: "Active" }),
            apiCall ? this.renderUpdateFormButtons() : this.renderNewFormButtons(),
            React.createElement(FlatButton_1.default, { key: 9, onClick: this.clearForm, label: "Clear", primary: true }),
            apiCall ?
                React.createElement(FlatButton_1.default, { key: 10, onClick: this.handleCancel, label: "Cancel", primary: true }) : undefined));
    };
    return ApiForm;
}(React.Component));
exports.ApiForm = ApiForm;
/**
 * Initialize the form with the values of the incoming API call
 *
 * @param {IReduxState} state - application state
 * @param {IApiFormProps} ownProps - props that were passed directly to the component
 * @returns
 */
function mapStateToProps(state, ownProps) {
    if (ownProps.apiCall) {
        return { initialValues: ownProps.apiCall };
    }
    return { initialValues: { active: true } };
}
// Decorate the form component
var ApiFormDecorated = redux_form_1.reduxForm({
    form: exports.FORM_NAME,
})(ApiForm);
exports.default = react_redux_1.connect(mapStateToProps)(ApiFormDecorated);
