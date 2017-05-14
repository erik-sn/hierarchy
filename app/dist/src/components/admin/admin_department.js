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
var MenuItem_1 = require("material-ui/MenuItem");
var SelectField_1 = require("material-ui/SelectField");
var add_1 = require("material-ui/svg-icons/content/add");
var React = require("react");
var types_1 = require("../../actions/types");
var modal_1 = require("../modal");
var department_form_1 = require("./forms/department_form");
/**
 * Controller component that handles operations on Department objects
 *
 * @class Department
 * @extends {React.Component<IDepartmentProps, IDepartmentState>}
 */
var Department = (function (_super) {
    __extends(Department, _super);
    function Department(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            department: undefined,
            showNewForm: false,
        };
        _this.createDepartment = _this.createDepartment.bind(_this);
        _this.updateDepartment = _this.updateDepartment.bind(_this);
        _this.toggleShowNewDepartmentForm = _this.toggleShowNewDepartmentForm.bind(_this);
        _this.resetState = _this.resetState.bind(_this);
        return _this;
    }
    /**
     * Given a site object, render all of its departments into MenuItems
     *
     * @param {ISite} site - site object to retrieve departments from
     * @returns {JSX.Element[]}
     *
     * @memberOf Department
     */
    Department.prototype.renderDepartmentList = function (site) {
        var _this = this;
        return site.departments.map(function (department, i) {
            var onDepartmentClick = function () { return _this.setState({ department: department }); };
            return (React.createElement(MenuItem_1.default, { key: i, value: department.name, primaryText: department.name, onTouchTap: onDepartmentClick }));
        });
    };
    /**
     * Create a department object
     *
     * @param {IDepartment} department
     *
     * @memberOf Department
     */
    Department.prototype.createDepartment = function (department) {
        var _this = this;
        var departmentWithSite = department;
        departmentWithSite.site = this.props.site.id;
        axios.post(types_1.default.API + "/departments/", departmentWithSite, types_1.default.API_CONFIG)
            .then(function () { return _this.props.message("Department Successfully Created: " + department.name); })
            .then(function () { return _this.props.fetchHierarchy(); })
            .catch(function () { return _this.props.message("Error Creating Department: " + department.name); })
            .then(function () { return _this.resetState(); });
    };
    /**
     * Update a department object
     *
     * @param {IDepartment} department
     *
     * @memberOf Department
     */
    Department.prototype.updateDepartment = function (department) {
        var _this = this;
        var departmentWithSite = department;
        departmentWithSite.site = this.props.site.id;
        axios.put(types_1.default.API + "/departments/" + department.id + "/", departmentWithSite, types_1.default.API_CONFIG)
            .then(function () { return _this.props.message("Department Successfully Updated: " + department.name); })
            .then(function () { return _this.props.fetchHierarchy(); })
            .catch(function () { return _this.props.message("Error Updating Department: " + department.name); })
            .then(function () { return _this.resetState(); });
    };
    /**
     * Reset the component back to default state
     *
     * @memberOf Department
     */
    Department.prototype.resetState = function () {
        this.setState({ department: undefined, showNewForm: false });
    };
    /**
     * Toggle the showNewForm state which controls whether or not a
     * Modal containing an empty department form is rendered
     *
     * @memberOf Department
     */
    Department.prototype.toggleShowNewDepartmentForm = function () {
        this.setState({ showNewForm: !this.state.showNewForm });
    };
    /**
     * Render the Create form. This is a a clean department form
     * inside a modal object
     *
     * @returns {JSX.Element}
     *
     * @memberOf Department
     */
    Department.prototype.renderNewDepartment = function () {
        return (React.createElement(modal_1.default, { title: "Create New Department", onCancel: this.toggleShowNewDepartmentForm },
            React.createElement(department_form_1.default, { submitForm: this.createDepartment })));
    };
    /**
     * Render the edit form. This is aa department form with values
     * corresponding to the parameter department. Rendered inside a
     * Modal
     *
     * @param {IDepartment} department - department to edit/delete
     * @returns {JSX.Element}
     *
     * @memberOf Department
     */
    Department.prototype.renderUpdateDepartmentForm = function (department) {
        return (React.createElement(department_form_1.default, { key: department.id, submitForm: this.updateDepartment, department: department, modules: this.props.modules, apiCalls: this.props.apicalls, cancel: this.resetState }));
    };
    /**
     * JSX helper method that renders the add button
     *
     * @returns {JSX.Element}
     *
     * @memberOf Department
     */
    Department.prototype.renderAddDepartmentButton = function () {
        return (React.createElement(FlatButton_1.default, { onClick: this.toggleShowNewDepartmentForm, label: "Add Department", icon: React.createElement(add_1.default, null), primary: true }));
    };
    Department.prototype.render = function () {
        var site = this.props.site;
        var _a = this.state, department = _a.department, showNewForm = _a.showNewForm;
        return (React.createElement("div", { className: "admin__department-container" },
            showNewForm ? this.renderNewDepartment() : undefined,
            React.createElement(SelectField_1.default, { maxHeight: 250, className: "admin__form-field", value: department ? department.name : '' }, this.renderDepartmentList(site)),
            department ? this.renderUpdateDepartmentForm(department) : this.renderAddDepartmentButton()));
    };
    return Department;
}(React.Component));
exports.default = Department;
