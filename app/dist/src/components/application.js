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
var Card_1 = require("material-ui/Card");
var React = require("react");
var react_redux_1 = require("react-redux");
var api_1 = require("../actions/api");
var index_1 = require("../actions/index");
var resolver_1 = require("../utils/resolver");
var loader_1 = require("./loader");
var modal_1 = require("./modal");
var navbar_1 = require("./navbar/navbar");
var Application = (function (_super) {
    __extends(Application, _super);
    function Application() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Application.prototype.componentDidMount = function () {
        var _a = this.props, user = _a.user, userError = _a.userError, sites = _a.sites, siteError = _a.siteError;
        if (!userError && !siteError && user && !user.username) {
            this.props.fetchAuth();
        }
        if (!userError && !siteError && !sites) {
            this.props.fetchHierarchy();
        }
    };
    Application.prototype.render = function () {
        var _a = this.props, user = _a.user, location = _a.location, userError = _a.userError, sites = _a.sites, siteError = _a.siteError, children = _a.children, modal = _a.modal, config = _a.config;
        // check to see if there are any errors
        var error;
        if (userError || siteError) {
            error = (React.createElement(modal_1.default, { title: "Error", error: true, contentClass: "modal__error", message: "There was an error retrieving application information - \n            please refresh the page or contact the administrator" }));
        }
        // wait for hierarchy and authentication information to load
        var loader;
        if (!user || !user.username || !sites) {
            loader = React.createElement("div", { style: { marginTop: '20%' } },
                React.createElement(loader_1.default, { scale: 2 }));
        }
        var modalComponent;
        if (modal && modal.showModal && modal.component) {
            modalComponent = modal.component;
        }
        var hierarchy;
        var content;
        if (sites && location) {
            // check to see if hiearchy exists, if not do not resolve path
            try {
                hierarchy = resolver_1.resolvePath(sites, location.pathname);
            }
            catch (e) {
                hierarchy = undefined;
            }
            var cloneChild = function (child) { return React.cloneElement(child, { sites: sites, hierarchy: hierarchy }); };
            content = React.Children.map(children, cloneChild);
        }
        return (React.createElement("div", { className: "application__container" },
            React.createElement(navbar_1.default, { sites: sites, user: user, hierarchy: hierarchy, path: location.pathname, config: config }),
            React.createElement("div", { className: "application__content-container" },
                React.createElement(Card_1.Card, { className: "application__content-card", style: { padding: '25px', width: '100%' }, containerStyle: { width: '100%' } }, error || loader || modalComponent || content))));
    };
    return Application;
}(React.Component));
exports.Application = Application;
function mapStateToProps(state) {
    return {
        user: state.auth.user,
        userError: state.auth.error,
        sites: state.hierarchy.sites,
        siteError: state.hierarchy.error,
        modal: state.display.config,
        config: state.display.config,
    };
}
var ApplicationContainer = react_redux_1.connect(mapStateToProps, {
    showModal: index_1.showModal, fetchAuth: api_1.fetchAuth, fetchHierarchy: api_1.fetchHierarchy
})(Application);
exports.default = ApplicationContainer;
