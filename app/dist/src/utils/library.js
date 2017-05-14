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
var moment = require("moment");
var React = require("react");
/**
 * Given a component's name, require it and pass it the specified props
 * within a React component. This method is critical to the functionality
 * of the application. Because modules are specified in the database,
 * not the HierarchyTier component's themselves, dynamic requires are
 * essential to the flexibility of the application.
 *
 * By convention these dynamic components are stored in the __modules__
 * directory, then given a directory with their name. The index of the
 * component must also be given the same name.
 *
 * @export
 * @param {string} name - React component to import
 * @param {*} props - properties to pass to the component
 * @returns {JSX.Element}
 */
function getComponent(name, props, directory) {
    if (directory === void 0) { directory = '__modules__'; }
    try {
        var Component = require("../components/" + directory + "/" + name + "/" + name + ".tsx").default;
        return React.createElement(Component, __assign({}, props));
    }
    catch (err) {
        console.error(err);
        return React.createElement("h3", { style: { textAlign: 'center' } }, "There was an error loading this module");
    }
}
exports.getComponent = getComponent;
/**
 * Iterate over the input list and check whether or not all members
 * of an object are or can be parsed into moment.js objects. If any
 * value cannot be parsed return false, otherwise true.
 *
 * @param {IDictionary[]} list - list of objects to analyze
 * @param {string} parameter - the field of a map object for which each map is checked
 * @returns {boolean}
 *
 */
function isMomentParameter(list, parameter) {
    var isMoment = !list.some(function (listItem) { return !moment(listItem[parameter]).isValid(); });
    return isMoment;
}
exports.isMomentParameter = isMomentParameter;
/**
 * Iterate over the input list and check whether or not all members
 * of an object are or can be converted to numbers. If any value cannot
 * be converted return false, otherwise true.
 *
 * @param {Array<IDictionary<any>>} list - list of dictionaries
 * @param {string} parameter - the field of a map object for which each map is checked
 * @returns {boolean}
 *
 */
function isNumberParameter(list, parameter) {
    return !list.some(function (listItem) { return isNaN(Number(listItem[parameter])); });
}
exports.isNumberParameter = isNumberParameter;
/**
 * Given a string add commas every 3 digits to add readability. Only add
 * commas if the length (left of the decimal point) is at least the minLength
 * parameter, which defaults to 4.
 *
 * @export
 * @param {string} inputValue - string to be commafied
 * @param {number} [minLength=4] - minimum length of the integer values before any
 * commas are added
 * @returns {string}
 */
function commafy(inputValue, minLength) {
    if (minLength === void 0) { minLength = 4; }
    var str = inputValue.split('.');
    if (str[0].length >= minLength) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    return str.join('.');
}
exports.commafy = commafy;
