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
var react_router_1 = require("react-router");
var redux_form_1 = require("redux-form");
var form_renderer_1 = require("../../../utils/form_renderer");
var module_edit_1 = require("./module_edit");
/**
 * Form component used for CRUD operations on the Site object
 *
 * @class SiteForm
 * @extends {React.Component<ISiteFormProps, {}>}
 */
var SiteForm = (function (_super) {
    __extends(SiteForm, _super);
    function SiteForm(props) {
        var _this = _super.call(this, props) || this;
        _this.clearForm = _this.clearForm.bind(_this);
        _this.navigateHome = _this.navigateHome.bind(_this);
        return _this;
    }
    /**
     * helper function to clean jsx, render the ModuleEdit interface
     *
     * @returns {JSX.Element}
     *
     * @memberOf SiteForm
     */
    SiteForm.prototype.renderModuleEdit = function () {
        var _a = this.props, change = _a.change, modules = _a.modules, site = _a.site;
        return (React.createElement(module_edit_1.default, { parentObject: site, modules: modules, change: change }));
    };
    /**
     * navigate using react-router back to the hierarchy home
     *
     * @memberOf SiteForm
     */
    SiteForm.prototype.navigateHome = function () {
        react_router_1.browserHistory.push('/admin/hierarchy/');
    };
    /**
     * Reset form back to default values
     *
     * @memberOf SiteForm
     */
    SiteForm.prototype.clearForm = function () {
        var change = this.props.change;
        change('name', '');
        change('code', '');
        change('directory', '');
        change('active', true);
        change('location', '');
        change('address', '');
        change('latitude', '');
        change('longitude', '');
    };
    SiteForm.prototype.render = function () {
        var _a = this.props, change = _a.change, submitForm = _a.submitForm, handleSubmit = _a.handleSubmit, site = _a.site, modules = _a.modules;
        return (React.createElement("form", { onSubmit: handleSubmit(submitForm), className: "admin__form-container" },
            React.createElement("div", { className: "admin__form-section" },
                React.createElement("h3", null, "General"),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "id", component: form_renderer_1.renderNullField }),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "name", component: form_renderer_1.renderTextField, label: "Name" }),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "code", component: form_renderer_1.renderTextField, label: "Code" }),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "directory", component: form_renderer_1.renderTextField, label: "Directory" }),
                React.createElement("div", { style: { width: '100%', height: '20px' } }),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "active", type: "checkbox", component: form_renderer_1.RenderCheckbox, label: "Active" }),
                React.createElement("div", { style: { width: '100%', height: '30px' } })),
            React.createElement("div", { className: "admin__form-section" },
                React.createElement("h3", null, "Location"),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "location", component: form_renderer_1.renderTextField, label: "Location" }),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "address", component: form_renderer_1.renderTextField, label: "Address" }),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "latitude", component: form_renderer_1.renderTextField, label: "Latitude" }),
                React.createElement(redux_form_1.Field, { className: "admin__form-field", name: "longitude", component: form_renderer_1.renderTextField, label: "Longitude" })),
            React.createElement("div", { className: "admin__form-section" }, site ? this.renderModuleEdit() : undefined),
            React.createElement("div", { className: "admin__lower-form-section" },
                React.createElement(FlatButton_1.default, { label: "Submit", type: "submit", keyboardFocused: true, primary: true }),
                React.createElement(FlatButton_1.default, { label: "Clear", onClick: this.clearForm, primary: true }),
                site ?
                    React.createElement(FlatButton_1.default, { label: "Cancel", onClick: this.navigateHome, primary: true }) : undefined)));
    };
    return SiteForm;
}(React.Component));
exports.SiteForm = SiteForm;
/**
 * Initialize the form with the site that was passed through props
 * or a set of default values if it does not exist
 *
 * @param {IReduxState} state
 * @param {ISiteFormProps} ownProps
 * @returns {IFormValues}
 */
function mapStateToProps(state, ownProps) {
    if (ownProps.site) {
        return { initialValues: ownProps.site };
    }
    return { initialValues: { active: true, modules: [] } };
}
// Decorate the form component
var SiteFormDecorated = redux_form_1.reduxForm({
    form: 'site_config',
})(SiteForm);
exports.default = react_redux_1.connect(mapStateToProps)(SiteFormDecorated);
