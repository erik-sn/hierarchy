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
var module_form_1 = require("./forms/module_form");
/**
 * Controller for operations on Module objects
 *
 * @export
 * @class ModuleAdmin
 * @extends {React.Component<IModulesProps, IModulesState>}
 */
var ModuleAdmin = (function (_super) {
    __extends(ModuleAdmin, _super);
    function ModuleAdmin(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            modules: undefined,
            activeModule: undefined,
            messageText: '',
            messageShow: false,
            filter: '',
            showNewForm: false,
        };
        _this.createModule = _this.createModule.bind(_this);
        _this.updateModule = _this.updateModule.bind(_this);
        _this.deleteModule = _this.deleteModule.bind(_this);
        _this.resetState = _this.resetState.bind(_this);
        _this.showMessage = _this.showMessage.bind(_this);
        _this.handleModuleFilter = _this.handleModuleFilter.bind(_this);
        _this.handleMessageClose = _this.handleMessageClose.bind(_this);
        _this.fetchModules = _this.fetchModules.bind(_this);
        _this.toggleShowNewForm = _this.toggleShowNewForm.bind(_this);
        return _this;
    }
    ModuleAdmin.prototype.componentDidMount = function () {
        this.fetchModules();
    };
    /**
     * Retrieve a list of all modules in the database
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.fetchModules = function () {
        var _this = this;
        axios.get(types_1.default.API + "/modules/?inactive=true", types_1.default.API_CONFIG)
            .then(function (_a) {
            var data = _a.data;
            _this.setState({ modules: data });
        });
    };
    /**
     * Create a module in the database
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.createModule = function () {
        var _this = this;
        var moduleForm = this.props.moduleForm;
        axios.post(types_1.default.API + "/modules/", moduleForm, types_1.default.API_CONFIG)
            .then(function () { return _this.fetchModules(); })
            .then(function () { return _this.showMessage("Module Successfully Created: " + moduleForm.name); })
            .catch(function () { return _this.showMessage("Error Creating Module: " + moduleForm.name); })
            .then(function () { return _this.resetState(); });
    };
    /**
     * Update a module in the database
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.updateModule = function () {
        var _this = this;
        var moduleForm = this.props.moduleForm;
        axios.put(types_1.default.API + "/modules/" + this.state.activeModule.id + "/", moduleForm, types_1.default.API_CONFIG)
            .then(function () { return _this.fetchModules(); })
            .then(function () { return _this.showMessage("Module Successfully Updated: " + _this.state.activeModule.name); })
            .catch(function () { return _this.showMessage("Error Updating Module: " + _this.state.activeModule.name); })
            .then(function () { return _this.resetState(); });
    };
    /**
     * Delete a module from the database
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.deleteModule = function () {
        var _this = this;
        axios.delete(types_1.default.API + "/modules/" + this.state.activeModule.id + "/", types_1.default.API_CONFIG)
            .then(function () { return _this.fetchModules(); })
            .then(function () { return _this.showMessage("Module Successfully Deleted: " + _this.state.activeModule.name); })
            .catch(function () { return _this.showMessage("Error Deleting Module: " + _this.state.activeModule.name); })
            .then(function () { return _this.resetState(); });
    };
    /**
     * Reset the component back to default state
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.resetState = function () {
        this.setState({
            activeModule: undefined,
            showNewForm: false,
        });
    };
    /**
     * Show a message inside a Snackbar to the user
     *
     * @param {string} messageText - text to show
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.showMessage = function (messageText) {
        this.setState({
            messageShow: true,
            messageText: messageText,
        });
    };
    /**
     * Close the Snackbar message
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.handleMessageClose = function () {
        this.setState({ messageShow: false });
    };
    /**
     * Set the list filter to the value of the user input in the filter
     * TextField
     *
     * @param {React.FormEvent<HTMLInputElement>} event
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.handleModuleFilter = function (event) {
        event.preventDefault();
        this.setState({
            filter: event.currentTarget.value,
        });
    };
    /**
     * Filter the modules stored in state by the user input in the filter
     * field.
     *
     * @returns {IModule[]}
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.filterModules = function () {
        var _a = this.state, modules = _a.modules, filter = _a.filter;
        if (filter.trim()) {
            return modules.filter(function (module) { return (module.name.toLowerCase().indexOf(filter.toLowerCase()) > -1); });
        }
        return modules;
    };
    /**
     * Generate a list of ListItems that contain module information.
     *
     * @returns {JSX.Element[]}
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.generateModuleList = function () {
        var _this = this;
        return this.filterModules().map(function (module, i) {
            var clickModuleItem = function () { return _this.setState({ activeModule: module }); };
            return (React.createElement(List_1.ListItem, { key: i, onClick: clickModuleItem, primaryText: module.name, secondaryText: module.description }));
        });
    };
    /**
     * Toggle the state of showNewForm which controls the Modal
     * element
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.toggleShowNewForm = function () {
        this.setState({
            activeModule: undefined,
            showNewForm: !this.state.showNewForm,
        });
    };
    /**
     * Render the Create form. This is an empty form rendered
     * inside a Modal object for creation of new module objects.
     *
     * @returns {JSX.Element}
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.renderNewModuleForm = function () {
        return (React.createElement(modal_1.default, { title: "Create New Module", onCancel: this.toggleShowNewForm },
            React.createElement(module_form_1.default, { submitForm: this.createModule })));
    };
    /**
     * Render the Edit form. This form is passed the activeModule
     * which is used to set intial values in the form.
     *
     * @returns {JSX.Element}
     *
     * @memberOf ModuleAdmin
     */
    ModuleAdmin.prototype.renderUpdateModuleForm = function () {
        return (React.createElement(module_form_1.default, { module: this.state.activeModule, submitForm: this.updateModule, remove: this.deleteModule }));
    };
    ModuleAdmin.prototype.render = function () {
        var _a = this.state, activeModule = _a.activeModule, modules = _a.modules, showNewForm = _a.showNewForm;
        if (!modules) {
            return (React.createElement("div", { className: "admin__modules" },
                React.createElement(loader_1.default, null)));
        }
        return (React.createElement("div", { className: "admin__modules" },
            showNewForm ? this.renderNewModuleForm() : undefined,
            React.createElement("div", { className: "admin__modules-inner-container" },
                React.createElement("div", { className: "admin__modules-list-container" },
                    React.createElement(TextField_1.default, { id: "admin__modules-filter", hintText: "Module Filter", value: this.state.filter, onChange: this.handleModuleFilter }),
                    React.createElement(List_1.List, { style: { maxHeight: '400px', overflowY: 'auto' } }, this.generateModuleList()),
                    React.createElement("div", { className: "admin__modules-new-module-container", onClick: this.toggleShowNewForm },
                        React.createElement(add_1.default, null),
                        React.createElement("span", null, "New Module"))),
                React.createElement("div", { className: "admin__modules-form-container" }, activeModule ? this.renderUpdateModuleForm() : React.createElement("h3", null, "Select a Module"))),
            React.createElement(Snackbar_1.default, { open: this.state.messageShow, message: this.state.messageText, action: "Ok", autoHideDuration: 10000, onActionTouchTap: this.handleMessageClose, onRequestClose: this.handleMessageClose })));
    };
    return ModuleAdmin;
}(React.Component));
exports.ModuleAdmin = ModuleAdmin;
/**
 * Initialize the form using Redux state
 *
 * @param {IReduxState} state
 * @returns
 */
function mapStateToProps(state) {
    if (!state.form[module_form_1.FORM_NAME]) {
        return { moduleForm: {} };
    }
    return { moduleForm: state.form[module_form_1.FORM_NAME].values || {} };
}
exports.default = react_redux_1.connect(mapStateToProps)(ModuleAdmin);
