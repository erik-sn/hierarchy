"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var moment = require("moment");
var stats_1 = require("./stats");
function getDateFromCreated(data) {
    return data.map(function (e) { return (e.set('date', moment(e.get('created')).format('HH:mm'))); });
}
exports.getDateFromCreated = getDateFromCreated;
function parseDateMap(type, parent, data) {
    return data.reduce(function (map, cur) {
        var date = cur.get('date');
        if (map.has(date)) {
            return map.set(date, map.get(date).push(cur.get('value')));
        }
        else {
            return map.set(date, immutable_1.List([cur.get('value')]));
        }
    }, immutable_1.Map());
}
exports.parseDateMap = parseDateMap;
function sortByDate(a, b) {
    var dateA = moment(a.get('date'), 'HH:mm');
    var dateB = moment(b.get('date'), 'HH:mm');
    return dateA > dateB ? 1 : -1;
}
exports.sortByDate = sortByDate;
function parseTimeSeries(type, parent, data) {
    var dataWithDate = getDateFromCreated(data);
    if (type === 'machine') {
        return dataWithDate.filter(function (obj) { return obj.get('machine') === parent.id; });
    }
    else {
        var dateMap = parseDateMap(type, parent, dataWithDate);
        return dateMap.map(function (v, k) { return immutable_1.Map({ date: k, value: stats_1.average(v) }); })
            .toList()
            .sort(sortByDate);
    }
}
exports.parseTimeSeries = parseTimeSeries;
