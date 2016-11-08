/**
 * Sorting function that compares alpha numeric groups in a string
 * @param  {} a
 * @param  {} b
 */
export function alphaNumSort(a, b) {
  if (!a || typeof a !== 'string' || !b || typeof b !== 'string') {
    throw Error('Inputs must be valid strings');
  }
  const groupsA = a.match(/[a-zA-Z]+|[0-9]+/g);
  const groupsB = b.match(/[a-zA-Z]+|[0-9]+/g);
  const shortest = groupsA.length > groupsB.length ? groupsA.length : groupsB.length;
  for (let i = 0; i < shortest; i++) {
    if (groupsA[i] !== groupsB[i]) {
      return groupsA[i] > groupsB[i] ? 1 : -1;
    }
  }
  return 0;
}