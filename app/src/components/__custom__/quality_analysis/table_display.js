import React, { PropTypes } from 'react';

import { List, Map } from 'immutable';
import FilterTable from '../../utility/filter_table/filter_table';



const TableDisplay = ({ data, rowMap, showModal }) => {
  return (
    <div className="quality_analysis__table-container" >
      <FilterTable
        className="quality_analysis__table-filter-table"
        handleRowClick={showModal}
        rowMap={rowMap}
        tableData={data}
        csv
        filter
        results
      />
    </div>
  );
};

TableDisplay.propTypes = {
  data: PropTypes.object,
  rowMap: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
};

export default TableDisplay;
