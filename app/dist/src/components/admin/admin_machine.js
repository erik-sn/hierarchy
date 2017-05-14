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
var machine_form_1 = require("./forms/machine_form");
/**
 * Controller component that handles operations on the Machine object
 *
 * @export
 * @class MachineAdmin
 * @extends {React.Component<IMachineAdminProps, IMachineAdminState>}
 */
var MachineAdmin = (function (_super) {
    __extends(MachineAdmin, _super);
    function MachineAdmin(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            showNewForm: false,
            department: undefined,
            machine: undefined,
            refreshDepartment: false,
        };
        _this.createMachine = _this.createMachine.bind(_this);
        _this.updateMachine = _this.updateMachine.bind(_this);
        _this.toggleShowNewMachineForm = _this.toggleShowNewMachineForm.bind(_this);
        _this.resetState = _this.resetState.bind(_this);
        return _this;
    }
    MachineAdmin.prototype.componentWillUpdate = function (nextProps) {
        var department = this.state.department;
        // after a machine is created/updated we set refreshDepartment to indicate that
        // the current department is no longer up to date. If a new set of props comes
        // through and that setting is in place, find the department with the same id
        // and update state to reflect the changes
        if (department && this.state.refreshDepartment) {
            var updatedDepartment = nextProps.site.departments.find(function (nextDepartment) { return (department.id === nextDepartment.id); });
            this.setState({ department: updatedDepartment, refreshDepartment: false });
        }
    };
    /**
     * Given a site, generate a list of MenuItems that contain departmets belonging
     * to that site.
     *
     * @param {ISite} site - site to generate department list for
     * @returns {JSX.Element[]}
     *
     * @memberOf MachineAdmin
     */
    MachineAdmin.prototype.renderDepartmentList = function (site) {
        var _this = this;
        return site.departments.map(function (department, i) {
            var departmentItemClick = function () { return _this.setActiveDepartment(department); };
            return (React.createElement(MenuItem_1.default, { key: i, value: department.name, primaryText: department.name, onClick: departmentItemClick }));
        });
    };
    /**
     * Given a department, generate a list of MenuItems that contain machines
     * belonging to that department
     *
     * @param {IDepartment} department - department to generate machine list for
     * @returns {JSX.Element[]}
     *
     * @memberOf MachineAdmin
     */
    MachineAdmin.prototype.renderMachineList = function (department) {
        var _this = this;
        if (!department) {
            return [];
        }
        var machineSort = function (a, b) { return a.name > b.name ? 1 : -1; };
        return department.machines.sort(machineSort).map(function (machine, i) {
            var machineItemClick = function () { return _this.setActiveMachine(machine); };
            return (React.createElement(MenuItem_1.default, { key: i, value: machine.name, primaryText: machine.name, onClick: machineItemClick }));
        });
    };
    /**
     * Set a department object as the active department
     *
     * @param {IDepartment} department
     *
     * @memberOf MachineAdmin
     */
    MachineAdmin.prototype.setActiveDepartment = function (department) {
        this.setState({ department: department });
    };
    /**
     * Set a machine object to as the active Machine
     *
     * @param {IMachine} machine
     *
     * @memberOf MachineAdmin
     */
    MachineAdmin.prototype.setActiveMachine = function (machine) {
        this.setState({ machine: machine });
    };
    /**
     * Create a machine object in thedatabase
     *
     * @param {IMachine} machine
     *
     * @memberOf MachineAdmin
     */
    MachineAdmin.prototype.createMachine = function (machine) {
        var _this = this;
        var updatedMachine = machine;
        updatedMachine.site = this.props.site.id;
        updatedMachine.department = this.state.department.id;
        axios.post(types_1.default.API + "/machines/", updatedMachine, types_1.default.API_CONFIG)
            .then(function () { return _this.props.message("Machine Successfully Created: " + updatedMachine.name); })
            .then(function () { return _this.props.fetchHierarchy(); })
            .catch(function () { return _this.props.message("Error Creating Machine: " + updatedMachine.name); })
            .then(function () { return _this.resetState(); });
    };
    /**
     * Update a machine object in the database
     *
     * @param {IMachine} machine
     *
     * @memberOf MachineAdmin
     */
    MachineAdmin.prototype.updateMachine = function (machine) {
        var _this = this;
        var updatedMachine = machine;
        updatedMachine.site = this.props.site.id;
        updatedMachine.department = this.state.department.id;
        axios.put(types_1.default.API + "/machines/" + updatedMachine.id + "/", updatedMachine, types_1.default.API_CONFIG)
            .then(function () { return _this.props.message("Machine Successfully Updated: " + updatedMachine.name); })
            .then(function () { return _this.props.fetchHierarchy(); })
            .catch(function () { return _this.props.message("Error Updating Machine: " + updatedMachine.name); })
            .then(function () { return _this.resetState(); });
    };
    /**
     * Toggle the state of showNewForm which controls whether or not a "New"
     * form is displayed to the user in a modal
     *
     * @memberOf MachineAdmin
     */
    MachineAdmin.prototype.toggleShowNewMachineForm = function () {
        this.setState({ showNewForm: !this.state.showNewForm });
    };
    /**
     * Reset the component to its default state
     *
     * @memberOf MachineAdmin
     */
    MachineAdmin.prototype.resetState = function () {
        this.setState({ machine: undefined, showNewForm: false, refreshDepartment: true });
    };
    /**
     * Render the Create form. This is an empty machine form that is displayed
     * to the user inside a Modal.
     *
     * @returns {JSX.Element}
     *
     * @memberOf MachineAdmin
     */
    MachineAdmin.prototype.renderNewMachineForm = function () {
        return (React.createElement(modal_1.default, { title: "Create New Machine", onCancel: this.toggleShowNewMachineForm },
            React.createElement(machine_form_1.default, { submitForm: this.createMachine })));
    };
    /**
     * If both a department and machine have been seleccted
     * then render a MachineForm with the machine object passed
     * as props. Otherwise prompt user to select a department/machine
     *
     * @returns {JSX.Element}
     *
     * @memberOf MachineAdmin
     */
    MachineAdmin.prototype.renderMenu = function () {
        var _a = this.state, department = _a.department, machine = _a.machine;
        if (department && machine) {
            return (React.createElement(machine_form_1.default, { submitForm: this.updateMachine, cancel: this.resetState, machine: machine, modules: this.props.modules }));
        }
        else if (department) {
            return (React.createElement(FlatButton_1.default, { onClick: this.toggleShowNewMachineForm, label: "Add Machine", icon: React.createElement(add_1.default, null), primary: true }));
        }
        return React.createElement("h3", null, "Select a Department");
    };
    MachineAdmin.prototype.render = function () {
        var site = this.props.site;
        var _a = this.state, department = _a.department, machine = _a.machine, showNewForm = _a.showNewForm;
        return (React.createElement("div", { className: "admin__machine-container" },
            showNewForm ? this.renderNewMachineForm() : undefined,
            React.createElement(SelectField_1.default, { className: "admin__form-field admin__department_select", hintText: "Department", value: department ? department.name : '' }, this.renderDepartmentList(site)),
            React.createElement(SelectField_1.default, { className: "admin__form-field admin__machine_select", hintText: "Machine", value: machine ? machine.name : '' }, this.renderMachineList(department)),
            this.renderMenu()));
    };
    return MachineAdmin;
}(React.Component));
exports.MachineAdmin = MachineAdmin;
exports.default = MachineAdmin;
