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
 * add or remove existing modules to a parent component. It is
 * designed to be generic in its implementation so any HierarchyTier
 * could potentially use it.
 *
 * @class ModuleEdit
 * @extends {React.Component<IModuleEditProps, IModuleEditState>}
 */
var ModuleEdit = (function (_super) {
    __extends(ModuleEdit, _super);
    function ModuleEdit(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            modules: props.parentObject.modules,
            defaultId: props.parentObject.defaultModule ? props.parentObject.defaultModule.id : -1,
        };
        return _this;
    }
    ModuleEdit.prototype.componentWillMount = function () {
        // initialize the form with the parent's module information
        var moduleIds = this.props.parentObject.modules.map(function (mdl) { return mdl.id; });
        this.props.change('modules', moduleIds);
        if (this.props.parentObject.defaultModule) {
            this.props.change('defaultModule', this.props.parentObject.defaultModule.id);
        }
    };
    /**
     * Add a module to the parent
     *
     * @param {IModule} module - module being added
     *
     * @memberOf ModuleEdit
     */
    ModuleEdit.prototype.handleAddModule = function (module) {
        // In order to avoid duplicates filter off any modules that have the same id as the one
        // we are creating - then push the new module to the array. If it is the only module
        // in the array set it as the defaultModule.
        var filteredModules = this.state.modules.filter(function (mdl) { return mdl.id !== module.id; });
        filteredModules.push(module);
        this.updateForm(filteredModules);
        if (filteredModules.length === 1) {
            this.updateDefaultModule(module.id);
        }
    };
    /**
     * Delete a module from the parent
     *
     * @param {IModule} module - module to delete
     *
     * @memberOf ModuleEdit
     */
    ModuleEdit.prototype.handleDeleteModule = function (module) {
        var modules = this.state.modules.filter(function (mdl) { return mdl.id !== module.id; });
        this.updateForm(modules);
        // if there are no modules left set the default to null
        if (modules.length === 0) {
            this.updateDefaultModule(null);
        }
        else {
            // if the default module was the one that was deleted then
            // set the first remaining module as default
            this.updateDefaultModule(modules[0].id);
        }
    };
    /**
     * Update the parent's from with a list of module primary keys
     * using the change function provided by redux form.
     *
     * @param {IModule[]} modules - modules that will be set into the parent's
     * module list
     *
     * @memberOf ModuleEdit
     */
    ModuleEdit.prototype.updateForm = function (modules) {
        var _this = this;
        var moduleIds = modules.map(function (mdl) { return mdl.id; });
        this.setState({ modules: modules }, function () {
            _this.props.change('modules', moduleIds);
        });
    };
    /**
     * Update the parent's default module. This module will appear
     * first in the module list to the users.
     *
     * @param {number} defaultId - primary key of the default module
     *
     * @memberOf ModuleEdit
     */
    ModuleEdit.prototype.updateDefaultModule = function (defaultId) {
        var _this = this;
        this.setState({ defaultId: defaultId }, function () { return (_this.props.change('defaultModule', defaultId)); });
    };
    /**
     * Generate a list of MenuItems that represent modules that
     * belong to the parent.
     *
     * @param {IModule[]} modules - parent's current modules
     * @returns {JSX.Element[]}
     *
     * @memberOf ModuleEdit
     */
    ModuleEdit.prototype.renderModuleMenu = function (modules) {
        var _this = this;
        var defaultId = this.state.defaultId;
        return modules.map(function (module, i) {
            var handleBodyClick = function () { return _this.updateDefaultModule(module.id); };
            var handleCloseClick = function () { return _this.handleDeleteModule(module); };
            return (React.createElement(MenuItem_1.default, { key: i, onTouchTap: handleBodyClick, className: defaultId === module.id ? 'admin__modules-default' : undefined, value: module.name, primaryText: module.name, rightIcon: React.createElement(close_1.default, { onClick: handleCloseClick }) }));
        });
    };
    /**
     * Generate a list of MenuItems that represent the available
     * modules that are available to add to the parent.
     *
     * @param {IModule[]} modules - available modules
     * @returns {JSX.Element[]}
     *
     * @memberOf ModuleEdit
     */
    ModuleEdit.prototype.renderModuleListItems = function (modules) {
        var _this = this;
        return modules.map(function (module, i) {
            var handleListItemClick = function () { return _this.handleAddModule(module); };
            return (React.createElement(MenuItem_1.default, { key: i, value: module.name, primaryText: module.name, onClick: handleListItemClick }));
        });
    };
    ModuleEdit.prototype.render = function () {
        var _a = this.state, modules = _a.modules, defaultId = _a.defaultId;
        return (React.createElement("div", { className: "admin__module-edit" },
            React.createElement("h3", null, "Modules"),
            React.createElement(List_1.List, null,
                modules && modules.length === 0 ? React.createElement("div", { className: "admin__message" }, "No Modules") : '',
                this.renderModuleMenu(modules)),
            React.createElement(SelectField_1.default, { style: { width: '100%' }, hintText: "Add Module", maxHeight: 300 }, this.props.modules ? this.renderModuleListItems(this.props.modules) : undefined)));
    };
    return ModuleEdit;
}(React.Component));
exports.default = ModuleEdit;
