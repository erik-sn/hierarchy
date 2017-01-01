import moment from 'moment';

const ISO_FORAMT = 'YYYY-MM-DDTHH:mm:ss';
const DEFAULT_FORMAT = 'MM/DD/YY HH:mm:ss';

/**
 * Given a date representing by an unformatted string, parse it into
 * a moment object and them format it back to a string using a specified
 * format, or the default format
 *
 * @param {string} unformattedString
 * @param {string} [format='MM/DD/YY HH:mm']
 */
export function parseAndFormat(unformattedString, format = DEFAULT_FORMAT) {
  return moment(unformattedString).format(format);
}
