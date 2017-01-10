import moment from 'moment';

/**
 * Sorting function that compares alpha numeric groups in two strings
 * @param  {string} a
 * @param  {string} b
 */
export function alphaNumSort(a, b) {
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

export function getDateSort(param = undefined, format = undefined) {
  const dateSort = (a, b) => {
    const aDate = param ? moment(a.get(param), format) : moment(a, format);
    const bDate = param ? moment(b.get(param), format) : moment(b, format);
    if (aDate > bDate) {
      return 1;
    } else if (aDate < bDate) {
      return -1;
    }
    return 0;
  };
  return dateSort;
}

export function getNumberSort(param = undefined) {
  const numberSort = (a, b) => {
    const aNumber = param ? a.get(param) : a;
    const bNumber = param ? b.get(param) : b;
    if (aNumber > bNumber) {
      return 1;
    } else if (aNumber < bNumber) {
      return -1;
    }
    return 0;
  };
  return numberSort;
}
