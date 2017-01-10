import { Map } from 'immutable';

import { INFINITY_TESTS } from './constants';

let LIMIT_LOOKUP = Map({});

/**
 * Given a set of limits, determine which limit is the "target"
 * limit. Priority is:
 * 1. Matching Lot Number
 * 2. Null Lot Number
 * 3. Most Recently created limit
 *
 * @param {string} lot - subgroup lot number
 * @param {object} limits - immutable list of limit objects
 * @returns
 */
function findLimit(lot, limits) {
  console.log(limits);
  const lotLimit = limits.find(limit => limit.get('lot') === lot);
  const nullLotLimit = limits.reverse().find(limit => limit.get('lot') === null);
  // 0 indicates most recent, list sorted by time DESC
  return lotLimit || nullLotLimit || limits.get(0);
}

function getClassName(value, limit) {
  const { lrl, lcl, ucl, url } = limit.toJS();
  if (!value) {
    return '';
  }
  if (lrl && value < lrl) {
    return 'infinity-alarm infinity-low';
  }
  if (lcl && value < lcl) {
    return 'infinity-warning infinity-low';
  }
  if (url && value > url) {
    return 'infinity-alarm infinity-high';
  }
  if (ucl && value > ucl) {
    return 'infinity-warning infinity-high';
  }
  return '';
}

export function getTargetLimit(subgroup, label, limits) {
  const part = subgroup.get('part');
  const lot = subgroup.get('lot');
  const unique = `${part}__${lot}__${label}`;
  if (LIMIT_LOOKUP.has(unique)) {
    return LIMIT_LOOKUP.get(unique);
  }
  const filteredLimits = limits.filter(limit => limit.get('part') === part && limit.get('test') === label);
  const limit = findLimit(lot, filteredLimits);
  // store the limit so it can be retrieved by another subgroup
  LIMIT_LOOKUP = LIMIT_LOOKUP.set(unique, limit);
  return limit;
}

export function analyzeSubgroup(rowMap, subgroup, limits) {
  const part = subgroup.get('part');
  const partLimits = limits.get(part);
  const classNames = rowMap.reduce((classMap, config) => {
    const label = config.get('label');
    if (INFINITY_TESTS.indexOf(label) === -1) {
      return classMap.set(label, '');
    }
    // if limits do not exist for this part
    if (!partLimits) {
      return classMap.set(label, 'infinity-invalid');
    }
    try {
      const limit = getTargetLimit(subgroup, label, partLimits);
      return classMap.set(label, getClassName(subgroup.get(label), limit));
    } catch (error) {
      // case  where limits do not exist for this column/test
      return classMap.set(label, 'infinity-error');
    }
  }, Map({}));
  return subgroup.set('classNames', classNames);
}