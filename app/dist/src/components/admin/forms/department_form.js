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
var api_edit_1 = require("./api_edit");
var module_edit_1 = require("./module_edit");
/**
 * Form to handle CRUD operations on department objects
 *
 * @class DepartmentForm
 * @extends {React.Component<IDepartmentFormProps, {}>}
 */
var DepartmentForm = (function (_super) {
    __extends(DepartmentForm, _super);
    function DepartmentForm(props) {
        var _this = _super.call(this, props) || this;
        _this.handleCancel = _this.handleCancel.bind(_this);
        return _this;
    }
    /**
     * actions to take when cancel button is clicked
     *
     * @memberOf DepartmentForm
     */
    DepartmentForm.prototype.handleCancel = function () {
        this.props.cancel();
        this.props.reset();
    };
    /**
     * helper method to contain rendering the Module and
     * Api Call edit components
     *
     * @returns {JSX.Element}
     *
     * @memberOf DepartmentForm
     */
    DepartmentForm.prototype.renderSubForms = function () {
        var _a = this.props, apiCalls = _a.apiCalls, change = _a.change, department = _a.department, modules = _a.modules;
        return (React.createElement("div", null,
            React.createElement(module_edit_1.default, { parentObject: department, modules: modules, change: change }),
            React.createElement(api_edit_1.default, { department: department, apiCalls: apiCalls, change: change })));
    };
    DepartmentForm.prototype.render = function () {
        var _a = this.props, handleSubmit = _a.handleSubmit, submitForm = _a.submitForm, change = _a.change, department = _a.department;
        return (React.createElement("form", { onSubmit: handleSubmit(submitForm), className: "admin__form-container" },
            React.createElement("div", { className: "admin__form-section" },
                React.createElement("div", { className: "mui-form-component" },
                    React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "name", component: form_renderer_1.renderTextField, label: "Name" }),
                    React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "defaultModule", component: form_renderer_1.renderNullField, label: "Default Module" }),
                    React.createElement("div", { style: { width: '100%', height: '20px' } }),
                    React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "active", type: "checkbox", component: form_renderer_1.RenderCheckbox, label: "Active" }),
                    React.createElement("div", { style: { width: '100%', height: '20px' } }))),
            React.createElement("div", { className: "admin__form-section" }, department ? this.renderSubForms() : undefined),
            React.createElement("div", { className: "admin__lower-form-section" },
                React.createElement(FlatButton_1.default, { label: department ? 'Update' : 'Create', type: "submit", keyboardFocused: true, primary: true }),
                React.createElement(FlatButton_1.default, { label: "Cancel", onClick: this.handleCancel, primary: true }))));
    };
    return DepartmentForm;
}(React.Component));
exports.DepartmentForm = DepartmentForm;
/**
 * Initialize the form with values from either the passed Department,
 * or a set of default values.
 *
 * @param {IReduxState} state
 * @param {IDepartmentFormProps} ownProps
 * @returns {IFormValues}
 */
function mapStateToProps(state, ownProps) {
    if (ownProps.department) {
        var initialValues = ownProps.department;
        var defaultModule = ownProps.department.defaultModule;
        initialValues.defaultModule = defaultModule ? defaultModule : undefined;
        return { initialValues: initialValues };
    }
    return { initialValues: { active: true, modules: [] } };
}
// Decorate the form component
var DepartmentFormDecorated = redux_form_1.reduxForm({
    form: 'department_form',
})(DepartmentForm);
exports.default = react_redux_1.connect(mapStateToProps)(DepartmentFormDecorated);
