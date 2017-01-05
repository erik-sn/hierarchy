import React, { Component, PropTypes } from 'react';

import { is, List, Map } from 'immutable';
import FilterTable from '../../utility/filter_table/filter_table';

let LIMIT_LOOKUP = Map({});

const INFINITY_TESTS = List(['Crimp', 'TR', 'Denier', 'FOY (NMR)', 'Entanglement', 'TiO2']);

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
  const lotLimit = limits.find(limit => limit.get('lot') === lot);
  const nullLotLimit = limits.find(limit => limit.get('lot') === null);
  // 0 indicates most recent, list sorted by time DESC
  return lotLimit || nullLotLimit || limits.get(0);
}

function getTargetLimit(subgroup, label, limits) {
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

function getClassName(value, limit) {
  const { lrl, lcl, ucl, url } = limit.toJS();
  if (!value) {
    return '';
  }
  if (value < lrl) {
    return 'infinity-alarm infinity-low';
  }
  if (value < lcl) {
    return 'infinity-warning infinity-low';
  }
  if (value > url) {
    return 'infinity-alarm infinity-high';
  }
  if (value > ucl) {
    return 'infinity-warning infinity-high';
  }
  return '';
}

function analyzeSubgroup(rowMap, subgroup, limits) {
  const part = subgroup.get('part');
  const partLimits = limits.get(part);
  const classNames = rowMap.reduce((classMap, config) => {
    const label = config.get('label');
    if (INFINITY_TESTS.indexOf(label) === -1) {
      return classMap.set(label, '');
    }
    const limit = getTargetLimit(subgroup, label, partLimits)
    return classMap.set(label, getClassName(subgroup.get(label), limit));
  }, Map({}));
  return subgroup.set('classNames', classNames);
}

class TableDisplay extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const { subgroups, limits } = this.props;
    return !is(subgroups, nextProps.subgroups) || !is(limits, nextProps.limits);
  }

  render() {
    const { subgroups, rowMap, showModal, limits } = this.props;
    const subgroupsWithClasses = subgroups.map(subgroup => analyzeSubgroup(rowMap, subgroup, limits));
    return (
      <div className="quality_analysis__table-container" >
        <FilterTable
          className="quality_analysis__table-filter-table"
          handleRowClick={showModal}
          rowMap={rowMap}
          tableData={subgroupsWithClasses}
          csv
          filter
          results
        />
      </div>
    );
  }
}

TableDisplay.propTypes = {
  subgroups: PropTypes.object,
  limits: PropTypes.object,
  rowMap: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
};

export default TableDisplay;
