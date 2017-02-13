import * as moment from 'moment';

/**
 * Sorting function that compares alpha numeric groups in two strings
 * @param  {string} a
 * @param  {string} b
 */
export function alphaNumSort(a: string, b: string): number {
  if (!a || typeof a !== 'string' || !b || typeof b !== 'string') {
    throw Error('Inputs must be valid strings');
  }
  const groupsA = a.match(/[a-zA-Z]+|[0-9]+/g);
  const groupsB = b.match(/[a-zA-Z]+|[0-9]+/g);
  const shortestGroup = groupsA.length > groupsB.length ? groupsA.length : groupsB.length;
  for (let i = 0; i < shortestGroup; i += 1) {
    if (groupsA[i] !== groupsB[i]) {
      return groupsA[i] > groupsB[i] ? 1 : -1;
    }
  }
  return 0;
}

export function generateDateSort(param: string = undefined, format: string = undefined): (a: any, b: any) => number {
  const dateSort = (a: any, b: any) => {
    const aDate = param ? moment(a[param], format) : moment(a, format);
    const bDate = param ? moment(b[param], format) : moment(b, format);
    if (aDate > bDate) {
      return 1;
    } else if (aDate < bDate) {
      return -1;
    }
    return 0;
  };
  return dateSort;
}

export function generateNumberSort(param: string = undefined): (a: any, b: any) => number {
  const numberSort = (a: any, b: any) => {
    const aNumber = param ? a[param] : a;
    const bNumber = param ? b[param] : b;
    if (aNumber > bNumber) {
      return 1;
    } else if (aNumber < bNumber) {
      return -1;
    }
    return 0;
  };
  return numberSort;
}
