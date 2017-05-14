"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
/**
 * Sorting function that compares alpha numeric groups in two strings
 * @param  {string} a
 * @param  {string} b
 */
function alphaNumSort(a, b) {
    if (!a || typeof a !== 'string' || !b || typeof b !== 'string') {
        throw Error('Inputs must be valid strings');
    }
    var groupsA = a.match(/[a-zA-Z]+|[0-9]+/g);
    var groupsB = b.match(/[a-zA-Z]+|[0-9]+/g);
    var shortestGroup = groupsA.length > groupsB.length ? groupsA.length : groupsB.length;
    for (var i = 0; i < shortestGroup; i += 1) {
        if (groupsA[i] !== groupsB[i]) {
            return groupsA[i] > groupsB[i] ? 1 : -1;
        }
    }
    return 0;
}
exports.alphaNumSort = alphaNumSort;
function generateDateSort(param, format) {
    if (format === void 0) { format = 'YYYY-MM-DD'; }
    var dateSort = function (a, b) {
        var aDate = param ? moment(a[param], format) : moment(a, format);
        var bDate = param ? moment(b[param], format) : moment(b, format);
        if (aDate > bDate) {
            return 1;
        }
        else if (aDate < bDate) {
            return -1;
        }
        return 0;
    };
    return dateSort;
}
exports.generateDateSort = generateDateSort;
function generateNumberSort(param) {
    var numberSort = function (a, b) {
        var aNumber = param ? a[param] : a;
        var bNumber = param ? b[param] : b;
        if (aNumber > bNumber) {
            return 1;
        }
        else if (aNumber < bNumber) {
            return -1;
        }
        return 0;
    };
    return numberSort;
}
exports.generateNumberSort = generateNumberSort;
