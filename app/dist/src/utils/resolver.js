"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_1 = require("react-router");
var appConfig = require('../../appconfig.json');
function parseSite(siteList, siteCode) {
    return siteList.find(function (site) { return (site.code.toLowerCase() === siteCode.toLowerCase()); });
}
exports.parseSite = parseSite;
function getDepartments(hierarchy, siteCode) {
    return parseSite(hierarchy, siteCode).departments;
}
exports.getDepartments = getDepartments;
function parseDepartment(hierarchy, siteCode, departmentName) {
    return getDepartments(hierarchy, siteCode).find(function (dpt) { return (dpt.name.toLowerCase() === departmentName.toLowerCase()); });
}
exports.parseDepartment = parseDepartment;
function getMachines(hierarchy, siteCode, departmentName) {
    return parseDepartment(hierarchy, siteCode, departmentName).machines;
}
exports.getMachines = getMachines;
function parseMachine(hierarchy, siteCode, departmentName, machineName) {
    return getMachines(hierarchy, siteCode, departmentName).find(function (mch) { return (mch.name.toLowerCase() === machineName.toLowerCase()); });
}
exports.parseMachine = parseMachine;
function parsePath(pathName) {
    var route = decodeURIComponent(pathName).replace(appConfig.baseUrl, '');
    // strip modules from route
    var moduleIndex = route.indexOf('/m/');
    var path = moduleIndex > 0 ? route.substring(0, moduleIndex) : route;
    return path.split('/').filter(function (param) { return param.trim() !== ''; });
}
exports.parsePath = parsePath;
function resolvePath(hierarchy, pathName) {
    var path = parsePath(pathName);
    var site = path[0] ? parseSite(hierarchy, path[0]) : undefined;
    var department = path[1] ? parseDepartment(hierarchy, path[0], path[1]) : undefined;
    var machine = path[2] ? parseMachine(hierarchy, path[0], path[1], path[2]) : undefined;
    return { site: site, department: department, machine: machine };
}
exports.resolvePath = resolvePath;
/**
 * Generate a function that pushes to react-router history based on
 * a specified base string
 * @param  {string} base - the base url of the string
 */
function buildNavigate(base) {
    if (!base) {
        throw Error('A base string is required');
    }
    return function (target) {
        react_router_1.browserHistory.push(base.toLowerCase() + "/" + target.toLowerCase() + "/");
    };
}
exports.buildNavigate = buildNavigate;
