import React, { PropTypes } from 'react';

import { List, Map } from 'immutable';
import FilterTable from '../../utility/filter_table/filter_table';

const rowMap = List([
  Map({ label: 'createDate', header: 'Time', width: '13%' }),
  Map({ label: 'lotNumber', header: 'Lot', width: '13%' }),
  Map({ label: 'partName', header: 'Yarn ID', width: '12%' }),
  Map({ label: 'subProcess', header: 'Pos.', width: '8%' }),
  Map({ label: 'Crimp', header: 'Crimp', width: '8%' }),
  Map({ label: 'TR', header: 'TR', width: '8%' }),
  Map({ label: 'Denier', header: 'Denier', width: '8%' }),
  Map({ label: 'FOY (NMR)', header: 'FOY', width: '8%' }),
  Map({ label: 'Entanglement', header: 'Tack', width: '8%' }),
  Map({ label: 'TiO2', header: 'TiO2', width: '8%' }),
]);


const TableDisplay = ({ data, showModal }) => {
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
  showModal: PropTypes.func.isRequired,
};

export default TableDisplay;
