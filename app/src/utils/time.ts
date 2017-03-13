import * as moment from 'moment';

const ISO_FORAMT = 'YYYY-MM-DDTHH:mm:ss';
const DEFAULT_FORMAT = 'MM/DD/YY HH:mm:ss';

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
export function parseAndFormat(unformattedString: string, format: string = DEFAULT_FORMAT): string {
  return moment(unformattedString).format(format);
}
