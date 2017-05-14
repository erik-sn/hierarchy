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
var React = require("react");
var react_motion_1 = require("react-motion");
var react_redux_1 = require("react-redux");
var library_1 = require("../../utils/library");
var notfound_1 = require("../notfound");
var machine_1 = require("./machine");
var index_1 = require("../../actions/index");
var renderModules_1 = require("./renderModules");
var Transition = require('react-motion-ui-pack').default;
var Department = (function (_super) {
    __extends(Department, _super);
    function Department(props) {
        var _this = _super.call(this, props) || this;
        _this.generateSpring = function (value) { return react_motion_1.spring(value, { stiffness: 70, damping: 40 }); };
        var department = props.hierarchy.department;
        var module = props.params.module;
        _this.state = {
            activeModule: module ? renderModules_1.retrieveModule(department, module) : department.defaultModule,
            url: window.location.pathname + "/" + department.name.toLowerCase(),
        };
        _this.setActiveModule = _this.setActiveModule.bind(_this);
        return _this;
    }
    Department.prototype.componentDidMount = function () {
        var _a = this.props, hierarchy = _a.hierarchy, fetchDepartmentData = _a.fetchDepartmentData;
        // apiCall objects are stored in the department hierarchy in the
        // databse. Iterate over each api call and update an index of redux
        // state with the data from the response
        hierarchy.department.apiCalls.forEach(function (apiCall) {
            fetchDepartmentData(hierarchy.department.id, apiCall.url, apiCall.key);
        });
    };
    Department.prototype.componentWillReceiveProps = function (nextProps) {
        var nextDepartment = nextProps.hierarchy.department;
        var url = window.location.pathname;
        // start at the default module, if the react-router params have a module
        // then search for that module in the department
        var activeModule = nextDepartment.defaultModule;
        if (nextProps.params.module) {
            activeModule = renderModules_1.retrieveModule(nextDepartment, nextProps.params.module);
        }
        this.setState({ url: url, activeModule: activeModule });
    };
    Department.prototype.setActiveModule = function (activeModule) {
        this.setState({ activeModule: activeModule });
    };
    Department.prototype.renderActiveModule = function () {
        var _a = this.props, departmentDataStore = _a.departmentDataStore, hierarchy = _a.hierarchy;
        var activeModule = this.state.activeModule;
        var componentProps = {
            key: hierarchy.department.id,
            type: 'department',
            parent: hierarchy.department,
            module: activeModule,
            departmentDataStore: departmentDataStore,
        };
        if (process.env.TEST) {
            return library_1.getComponent(activeModule.name, componentProps, '__test__');
        }
        return library_1.getComponent(activeModule.name, componentProps);
    };
    Department.prototype.render = function () {
        var _a = this.props, params = _a.params, departmentDataStore = _a.departmentDataStore, hierarchy = _a.hierarchy, notFound = _a.notFound;
        if (notFound) {
            return React.createElement(notfound_1.default, null);
        }
        var activeModule = this.state.activeModule;
        if (params.machine) {
            return (React.createElement(machine_1.default, { departmentDataStore: departmentDataStore, hierarchy: hierarchy, activeModuleLabel: params.module }));
        }
        return (React.createElement("div", { className: "display__container" },
            React.createElement("div", { className: "display__module-container" }, renderModules_1.default(activeModule, hierarchy.department, this.setActiveModule)),
            React.createElement(Transition, { key: activeModule ? activeModule.id : 1, component: 'div', enter: { opacity: this.generateSpring(1), scale: 1 }, leave: { opacity: this.generateSpring(0), scale: 0.99 } }, React.createElement("div", { key: activeModule ? activeModule.id + 1 : 2, className: "display__content-container" },
                React.createElement("div", { className: "display__component-container" }, !activeModule ? React.createElement("h3", { style: { textAlign: 'center' } }, "No Modules Available")
                    : this.renderActiveModule())))));
    };
    return Department;
}(React.Component));
exports.Department = Department;
function mapStateToProps(state, ownProps) {
    var id = ownProps.hierarchy.department.id;
    return { departmentDataStore: state.departmentStores.get(id) };
}
exports.default = react_redux_1.connect(mapStateToProps, { fetchDepartmentData: index_1.fetchDepartmentData })(Department);
