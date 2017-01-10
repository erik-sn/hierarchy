import React, { Component, PropTypes } from 'react';

import { is } from 'immutable';
import FilterTable from '../../utility/filter_table/filter_table';
import { analyzeSubgroup } from './utils';


class TableDisplay extends Component {

  shouldComponentUpdate(nextProps) {
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
