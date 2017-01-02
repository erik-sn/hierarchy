import React, { PropTypes } from 'react';
import { List, Map } from 'immutable';

import FilterTable from '../../utility/filter_table/filter_table';

const rowMap = List([
  Map({ header: 'Name', label: 'itemName', width: '25%' }),
  Map({ header: 'Tag', label: 'piTagName', width: '55%' }),
  Map({ header: 'Spec', label: 'specValue', width: '10%' }),
  Map({ header: 'PI', label: 'piTagValue', width: '10%' }),
]);

const tableSort = (a, b) => a.get('itemName').toLowerCase() > b.get('itemName').toLowerCase() ? 1 : -1;

const TableDisplay = ({ setpoints, selected, handleRowClick }) => {
  const tableData = setpoints.get(selected);
  return (
    <div className="spa__table-container" >
      <FilterTable
        className="spa__table-filter-table"
        handleRowClick={handleRowClick}
        rowMap={rowMap}
        tableData={tableData ? tableData.sort(tableSort) : tableData}
        csv
        filter
        results
      />
    </div>
  );
};

TableDisplay.propTypes = {
  handleRowClick: PropTypes.func,
  setpoints: PropTypes.object.isRequired,
  selected: PropTypes.string.isRequired,
};

export default TableDisplay;
