"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var ISO_FORAMT = 'YYYY-MM-DDTHH:mm:ss';
var DEFAULT_FORMAT = 'MM/DD/YY HH:mm:ss';
/**
 * Given a date representing by an unformatted string, parse it into
 * a moment object and them format it back to a string using a specified
 * format, or the default format
 *
 * @export
 * @param {string} unformattedString
 * @param {string} [format=DEFAULT_FORMAT]
 * @returns {string}
 */
function parseAndFormat(unformattedString, format) {
    if (format === void 0) { format = DEFAULT_FORMAT; }
    return moment(unformattedString).format(format);
}
exports.parseAndFormat = parseAndFormat;
