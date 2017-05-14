"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sort_1 = require("../../utils/sort");
var module_1 = require("./module");
/**
 * Generate a sorting function unique to a specific hierarchy
 * object. This function will compare all modules to the default
 * and set the default module as first in the list.
 *
 * @param {IHierarchyTier} hierarchyObject
 * @returns
 */
function generateSortModules(hierarchyObject) {
    // case where no default module was set in the admin page
    var defaultModule = hierarchyObject.defaultModule;
    var defaultId = defaultModule ? defaultModule.id : -1;
    return function (a, b) {
        if (a.id === defaultId) {
            return -1;
        }
        else if (b.id === defaultId) {
            return 1;
        }
        return 0;
    };
}
exports.generateSortModules = generateSortModules;
/**
 * Search a hierarchy object (machine/department) for a specific
 * module by label (case insensitive);
 *
 * @export
 * @param {IHierarchyTier} hierarchyObject
 * @param {string} moduleLabel
 * @returns
 */
function retrieveModule(hierarchyObject, moduleLabel) {
    return hierarchyObject.modules.find(function (mdl) { return (moduleLabel ? mdl.label.toLowerCase() === moduleLabel.toLowerCase() : false); });
}
exports.retrieveModule = retrieveModule;
/**
 * Generate an array of module objects. Modules are containers that hold
 * content - the user can click on tabs to navigate to them.
 *
 * Modules are first sorted alphanumerically, and then sorted again so
 * that the default module is first in the list.
 *
 * @export
 * @param {object} activeModule - module that the user currently has open
 * @param {object} hierarchyObject - the piece of hierarchy the user is navigating in -
 * machines, departments, etc.
 * @param {function} setActive - function passed to a module that is called when its tabs
 * is clicked on.
 * @returns
 */
function renderModules(activeModule, hierarchyObject, setActive) {
    var moduleProps = { activeModule: activeModule, setActive: setActive, hierarchyObject: hierarchyObject };
    return hierarchyObject.modules
        .sort(function (a, b) { return sort_1.alphaNumSort(a.name, b.name); })
        .sort(generateSortModules(hierarchyObject))
        .map(function (module, i) { return React.createElement(module_1.default, __assign({ key: i, module: module }, moduleProps)); });
}
exports.default = renderModules;
