/**
 * Module Created: 2016-12-04 10:25:41 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./pack_list.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';
import { List, Map } from 'immutable';

import Loader from '../../loader';
import FilterTable from '../../utility/filter_table/filter_table';

const CENTER = 'filter__table_column-center';

const rowMap = List([
  Map({ header: 'type', label: 'spinnerettetype', width: '10%', className: '' }),
  Map({ header: '#', label: 'spinnerettenumber', width: '10%', childrenClass: CENTER }),
  Map({ header: 'pos.', label: 'position', width: '10%', childrenClass: CENTER, className: CENTER }),
  Map({ header: 'l/m/r', label: 'threadline', width: '10%', childrenClass: CENTER, className: CENTER }),
  Map({ header: 'ii', label: 'installinit', width: '5%', className: '' }),
  Map({ header: 'install', label: 'installdate', width: '15%', className: '' }),
  Map({ header: 'ri', label: 'removeinit', width: '5%', className: '' }),
  Map({ header: 'remove', label: 'removedate', width: '15%', className: '' }),
  Map({ header: 'reason', label: 'removereason', width: '20%', className: '' }),
  Map({ header: 'age', label: 'age', width: '5%', className: '' }),
]);

function getRemoveReason(reasonNumber) {
  switch (reasonNumber) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return 'Pack Leak';
    case 6:
      return 'Mechanical';
    case 7:
      return 'Electrical';
    case 9:
      return 'Process Control';
    case 10:
      return 'No Visible Problem';
    case 11:
      return 'Product Change';
    default:
      return 'Other';
  }
}

function getPackData(data, parent) {
  return data.filter(row => `OX${row.get('line')}` === parent.get('name'));
}

function formatPackList(packList) {
  return packList.map((row) => {
    let cleaned = row.delete('primaryKey').delete('line').delete('screenSize');
    cleaned = cleaned.set('removereason', getRemoveReason(cleaned.get('removereason')));
    return cleaned.map(value => String(value));
  });
}

const PackList = ({ data, parent }) => {
  if (!data || !data.get('ox_packs') || !parent) {
    return <Loader />;
  }
  const packList = getPackData(data.get('ox_packs'), parent);
  return (
    <FilterTable
      className="processlog__filter-table"
      tableData={formatPackList(packList)}
      rowMap={rowMap}
      csv
      filter
      results
    />
  );
};


PackList.propTypes = {
  data: PropTypes.object,
  parent: PropTypes.object.isRequired,
};

export default PackList;
