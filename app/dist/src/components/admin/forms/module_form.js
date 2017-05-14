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
exports.FORM_NAME = 'MODULE-CONFIG';
/**
 * Form component to handle CRUD operations on the Module object
 *
 * @class ModuleForm
 * @extends {React.Component<IModuleFormProps, {}>}
 */
var ModuleForm = (function (_super) {
    __extends(ModuleForm, _super);
    function ModuleForm(props) {
        var _this = _super.call(this, props) || this;
        _this.handleDelete = _this.handleDelete.bind(_this);
        _this.handleClear = _this.handleClear.bind(_this);
        return _this;
    }
    ModuleForm.prototype.componentWillMount = function () {
        this.props.reset();
    };
    ModuleForm.prototype.componentWillReceiveProps = function (nextProps) {
        // if nextProps contains a module and it is different then the
        // current one, set it's values into the form.
        var _a = this.props, module = _a.module, change = _a.change;
        if (nextProps.module && module && nextProps.module.id !== module.id) {
            var updatedModule = nextProps.module;
            change('name', updatedModule.name);
            change('label', updatedModule.label);
            change('description', updatedModule.description);
            change('active', updatedModule.active);
        }
    };
    /**
     * actions to take when delete is clicked
     *
     * @memberOf ModuleForm
     */
    ModuleForm.prototype.handleDelete = function () {
        this.props.remove();
        this.props.reset();
    };
    /**
     * set the form back to default values
     *
     * @memberOf ModuleForm
     */
    ModuleForm.prototype.handleClear = function () {
        var change = this.props.change;
        change('name', '');
        change('label', '');
        change('description', '');
        change('active', true);
    };
    /**
     * Buttons to render when the form is for creating
     * a new Module object.
     *
     * @returns {JSX.Element}
     *
     * @memberOf ModuleForm
     */
    ModuleForm.prototype.renderNewFormButtons = function () {
        return (React.createElement(FlatButton_1.default, { key: 4, type: "submit", label: "Submit", primary: true }));
    };
    /**
     * Buttons to render when we are updating a module
     *
     * @returns {JSX.Element}
     *
     * @memberOf ModuleForm
     */
    ModuleForm.prototype.renderUpdateFormButtons = function () {
        return (React.createElement("div", null,
            React.createElement(FlatButton_1.default, { key: 1, type: "submit", label: "Update", primary: true }),
            React.createElement(FlatButton_1.default, { key: 2, onClick: this.handleDelete, label: "Delete", primary: true })));
    };
    ModuleForm.prototype.render = function () {
        var _a = this.props, submitForm = _a.submitForm, handleSubmit = _a.handleSubmit, remove = _a.remove, module = _a.module, reset = _a.reset;
        return (React.createElement("form", { onSubmit: handleSubmit(submitForm), className: "admin__form-container" },
            React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "name", component: form_renderer_1.renderTextField, label: "Name" }),
            React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "label", component: form_renderer_1.renderTextField, label: "Label" }),
            React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "description", component: form_renderer_1.renderTextField, label: "Description" }),
            React.createElement("div", { style: { width: '100%', height: '20px' } }),
            React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "active", type: "checkbox", component: form_renderer_1.RenderCheckbox, label: "Active" }),
            module ? this.renderUpdateFormButtons() : this.renderNewFormButtons(),
            React.createElement(FlatButton_1.default, { key: 9, onClick: this.handleClear, label: "Clear", primary: true })));
    };
    return ModuleForm;
}(React.Component));
exports.ModuleForm = ModuleForm;
/**
 * Initialize the form from the passed module, or if that does not exist
 * do so from a set of default values.
 *
 * @param {IReduxState} state
 * @param {IModuleFormProps} ownProps
 * @returns
 */
function mapStateToProps(state, ownProps) {
    if (ownProps.module) {
        return { initialValues: ownProps.module };
    }
    return { initialValues: { active: true } };
}
// Decorate the form component
var ModuleFormDecorated = redux_form_1.reduxForm({
    form: exports.FORM_NAME,
})(ModuleForm);
exports.default = react_redux_1.connect(mapStateToProps)(ModuleFormDecorated);
