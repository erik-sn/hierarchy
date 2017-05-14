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
var lock_1 = require("material-ui/svg-icons/action/lock");
var React = require("react");
var react_redux_1 = require("react-redux");
var api_1 = require("../../actions/api");
var resolver_1 = require("../../utils/resolver");
var admin_api_1 = require("./admin_api");
var admin_hierarchy_1 = require("./admin_hierarchy");
var admin_module_1 = require("./admin_module");
var admin_tabs_1 = require("./admin_tabs");
var appconfig = require('../../../appconfig.json');
var navigate = resolver_1.buildNavigate(appconfig.baseUrl + "/admin");
/**
 * High level admin controller element
 *
 * @export
 * @class Admin
 * @extends {Component}
 */
var Admin = (function (_super) {
    __extends(Admin, _super);
    /**
     * Creates an instance of Admin.
     *
     * @param {any} props
     *
     * @memberOf Admin
     */
    function Admin(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            activeMenu: props.params.menu || 'hierarchy',
        };
        return _this;
    }
    /**
     * Fetch the application hierarchy from the API - add the inactive flag
     * to the url to also retrieve sites that have been set inactive.
     *
     * @memberOf Admin
     */
    Admin.prototype.componentDidMount = function () {
        this.props.fetchHierarchy('?inactive=true');
    };
    /**
     * Render the correct menu based on the URL structure
     *
     * @returns JSX.Element
     *
     * @memberOf Admin
     */
    Admin.prototype.renderMenu = function () {
        var _a = this.props, fetchHierarchy = _a.fetchHierarchy, params = _a.params, sites = _a.sites;
        var menu = params.menu, splat = params.splat;
        switch (menu) {
            case 'apicalls':
                return React.createElement(admin_api_1.default, null);
            case 'modules':
                return React.createElement(admin_module_1.default, null);
            default:
                return React.createElement(admin_hierarchy_1.default, { splat: splat, sites: sites, fetchHierarchy: fetchHierarchy });
        }
    };
    Admin.prototype.render = function () {
        if (!this.props.user.admin) {
            return (React.createElement("div", { className: "admin__message" },
                React.createElement(lock_1.default, { style: { height: '200px', width: '200px', color: 'white' } }),
                React.createElement("h3", { style: { color: 'white' } }, "You are not authorized to view this section")));
        }
        return (React.createElement(Card_1.Card, { className: "admin__container" },
            React.createElement(Card_1.CardHeader, { titleStyle: { fontSize: '1.75rem' }, subtitleStyle: { fontSize: '1.15rem' }, title: "Admin", subtitle: "Application administration menu" }),
            React.createElement(admin_tabs_1.default, { navigate: navigate, value: this.props.params.menu }),
            this.renderMenu()));
    };
    return Admin;
}(React.Component));
exports.Admin = Admin;
function mapStateToProps(state) {
    return {
        user: state.auth.user,
        sites: state.hierarchy.sites,
    };
}
exports.default = react_redux_1.connect(mapStateToProps, { fetchHierarchy: api_1.fetchHierarchy })(Admin);
