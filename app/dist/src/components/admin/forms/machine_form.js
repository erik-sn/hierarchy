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
var module_edit_1 = require("./module_edit");
/**
 * form component to handle CRUD operations on Machine objects
 *
 * @class MachineForm
 * @extends {React.Component<IMachineFormProps, {}>}
 */
var MachineForm = (function (_super) {
    __extends(MachineForm, _super);
    function MachineForm(props) {
        var _this = _super.call(this, props) || this;
        _this.clearForm = _this.clearForm.bind(_this);
        _this.cancelForm = _this.cancelForm.bind(_this);
        return _this;
    }
    /**
     * Set the form back to all default values
     *
     * @memberOf MachineForm
     */
    MachineForm.prototype.clearForm = function () {
        var change = this.props.change;
        change('name', '');
        change('type', '');
        change('defaultModule', undefined);
        change('active', false);
    };
    /**
     * actions to take when the cancel button is clicked
     *
     * @memberOf MachineForm
     */
    MachineForm.prototype.cancelForm = function () {
        this.props.cancel();
    };
    /**
     * helper method to clean JSX, generate ModuleEdit interface
     *
     * @returns {JSX.Element}
     *
     * @memberOf MachineForm
     */
    MachineForm.prototype.renderModuleEdit = function () {
        var _a = this.props, machine = _a.machine, modules = _a.modules, change = _a.change;
        return (React.createElement(module_edit_1.default, { parentObject: machine, modules: modules, change: change }));
    };
    /**
     * helper method to clean JSX, generate cancel button
     *
     * @returns {JSX.Element}
     *
     * @memberOf MachineForm
     */
    MachineForm.prototype.renderCancelButton = function () {
        return (React.createElement(FlatButton_1.default, { label: "Cancel", onClick: this.cancelForm, primary: true }));
    };
    MachineForm.prototype.render = function () {
        var _a = this.props, handleSubmit = _a.handleSubmit, submitForm = _a.submitForm, machine = _a.machine;
        return (React.createElement("form", { onSubmit: handleSubmit(submitForm), className: "admin__form-container" },
            React.createElement("div", { className: "admin__machine-container" },
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "defaultModule", component: form_renderer_1.renderNullField, label: "Default Module" }),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "name", component: form_renderer_1.renderTextField, label: "Name" }),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "type", component: form_renderer_1.renderTextField, label: "Type" }),
                React.createElement("div", { style: { width: '100%', height: '20px' } }),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "active", type: "checkbox", component: form_renderer_1.RenderCheckbox, label: "Active" }),
                React.createElement("div", { style: { width: '100%', height: '20px' } })),
            React.createElement("div", { className: "admin__form-section" }, machine ? this.renderModuleEdit() : ''),
            React.createElement("div", { className: "admin__lower-form-section" },
                React.createElement(FlatButton_1.default, { label: machine ? 'Update' : 'Create', type: "submit", keyboardFocused: true, primary: true }),
                React.createElement(FlatButton_1.default, { label: "Clear", onClick: this.clearForm, primary: true }),
                machine ? this.renderCancelButton() : undefined)));
    };
    return MachineForm;
}(React.Component));
exports.MachineForm = MachineForm;
/**
 * Initialize the form state. If a machine was passed through props then
 * set that machine into the form. Otherwise use a default configuration
 */
function mapStateToProps(state, ownProps) {
    if (ownProps.machine) {
        return { initialValues: ownProps.machine };
    }
    return { initialValues: { active: true, modules: [], name: '', type: '' } };
}
// Decorate the form component
var MachineFormDecorated = redux_form_1.reduxForm({
    form: 'machine_form',
})(MachineForm);
exports.default = react_redux_1.connect(mapStateToProps)(MachineFormDecorated);
