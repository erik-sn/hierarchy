"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var resolver_1 = require("../../utils/resolver");
var admin_site_1 = require("./admin_site");
var admin_site_list_1 = require("./admin_site_list");
var appConfig = require('../../../appconfig.json');
var navigate = resolver_1.buildNavigate(appConfig.baseUrl + "/admin/hierarchy");
/**
 * High level hierarchy component - render either the Site List or Site
 * controller components
 */
exports.AdminHierarchy = function (props) {
    var sites = props.sites, splat = props.splat;
    var code = splat ? splat.split('/')[1] : undefined; // parse remainder url for parameters
    var activeSite;
    var siteNavigate;
    if (code) {
        activeSite = sites.find(function (site) { return code.toUpperCase() === site.code; });
        siteNavigate = resolver_1.buildNavigate(appConfig.baseUrl + "/admin/hierarchy/" + code);
    }
    var adminSiteList = (React.createElement(admin_site_list_1.default, { fetchHierarchy: props.fetchHierarchy, navigate: navigate, sites: sites }));
    var adminSite = (React.createElement(admin_site_1.default, { fetchHierarchy: props.fetchHierarchy, navigate: siteNavigate, site: activeSite, splat: splat }));
    return (React.createElement("div", { className: "admin__hierarchy-container" }, activeSite ? adminSite : adminSiteList));
};
exports.default = exports.AdminHierarchy;
