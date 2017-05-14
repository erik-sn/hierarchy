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
var renderModules_1 = require("./renderModules");
var Transition = require('react-motion-ui-pack').default;
var Machine = (function (_super) {
    __extends(Machine, _super);
    function Machine(props) {
        var _this = _super.call(this, props) || this;
        _this.generateSpring = function (value) { return react_motion_1.spring(value, { stiffness: 70, damping: 40 }); };
        var machine = props.hierarchy.machine;
        _this.state = {
            activeModule: props.activeModuleLabel ? renderModules_1.retrieveModule(machine, props.activeModuleLabel) : machine.defaultModule,
            url: "/" + window.location.pathname + "/" + machine.name.toLowerCase(),
            moduleExists: false,
        };
        _this.setActiveModule = _this.setActiveModule.bind(_this);
        return _this;
    }
    Machine.prototype.componentWillReceiveProps = function (nextProps) {
        var nextMachine = nextProps.hierarchy.machine;
        var url = window.location.pathname;
        if (nextMachine.id !== this.props.hierarchy.machine.id) {
            var activeModule = nextMachine.defaultModule;
            if (nextProps.activeModuleLabel) {
                activeModule = renderModules_1.retrieveModule(nextMachine, nextProps.activeModuleLabel);
            }
            this.setState({ url: url, activeModule: activeModule });
        }
        else {
            this.setState({ url: url });
        }
    };
    Machine.prototype.setActiveModule = function (activeModule) {
        this.setState({ activeModule: activeModule });
    };
    Machine.prototype.renderActiveModule = function () {
        var _a = this.props, departmentDataStore = _a.departmentDataStore, hierarchy = _a.hierarchy;
        var activeModule = this.state.activeModule;
        var componentProps = {
            key: hierarchy.machine.id,
            departmentId: hierarchy.department.id,
            type: 'machine',
            parent: hierarchy.machine,
            module: activeModule,
            departmentDataStore: departmentDataStore,
        };
        if (process.env.TEST) {
            return library_1.getComponent(activeModule.name, componentProps, '__test__');
        }
        return library_1.getComponent(activeModule.name, componentProps);
    };
    Machine.prototype.render = function () {
        var activeModule = this.state.activeModule;
        var hierarchy = this.props.hierarchy;
        var description = activeModule ? activeModule.description : undefined;
        return (React.createElement("div", { className: "display__container" },
            React.createElement("div", { className: "display__module-container" }, renderModules_1.default(activeModule, hierarchy.machine, this.setActiveModule)),
            React.createElement(Transition, { key: activeModule ? activeModule.id : 1, component: 'div', enter: { opacity: this.generateSpring(1), scale: 1 }, leave: { opacity: this.generateSpring(0), scale: 0.99 } }, React.createElement("div", { key: activeModule ? activeModule.id + 1 : 2, className: "display__content-container" },
                React.createElement("div", { className: "display__component-container" }, !activeModule ? React.createElement("h3", { style: { textAlign: 'center' } }, "No Modules Available")
                    : this.renderActiveModule())))));
    };
    return Machine;
}(React.Component));
exports.Machine = Machine;
function mapStateToProps(state, ownProps) {
    var id = ownProps.hierarchy.department.id;
    return { departmentDataStore: state.departmentStores.get(id) };
}
exports.default = react_redux_1.connect(mapStateToProps)(Machine);
