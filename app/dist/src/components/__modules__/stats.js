"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sum(input, key) {
    if (key === void 0) { key = undefined; }
    if (key) {
        return input.reduce(function (total, cur) { return total + cur.get(key); }, 0);
    }
    else {
        return input.reduce(function (total, cur) { return total + cur; }, 0);
    }
}
exports.sum = sum;
function average(input, key) {
    if (key === void 0) { key = undefined; }
    return sum(input, key) / input.size;
}
exports.average = average;
function computeStats(input, key) {
    if (key === void 0) { key = undefined; }
    var count = input.size;
    var avg = average(input, key);
    var sqerror = input.map(function (e) { return Math.pow(e.get('value') - avg, 2); });
    var sumSqError = sqerror.reduce(function (total, cur) { return total + cur; }, 0);
    var stdev = Math.sqrt(sum(sqerror) / count);
    return { count: count, avg: avg, stdev: stdev };
}
exports.computeStats = computeStats;
