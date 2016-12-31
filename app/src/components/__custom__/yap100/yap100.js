/**
 * Module Created: 2016-12-04 10:25:41 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./yap100.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';
import moment from 'moment';
import { List, Map } from 'immutable';

import Loader from '../../loader';
import FilterTable from '../../utility/filter_table/filter_table';

const rowMap = List([
  Map({ header: 'time', label: 'timestamp', width: '20%', className: '' }),
  Map({ header: 'shift', label: 'shift', width: '7%', className: '' }),
  Map({ header: 'type', label: 'transactionType', width: '15%', className: '' }),
  Map({ header: 'yarn id', label: 'yarnId', width: '16%', className: '' }),
  Map({ header: 'lot', label: 'lotNumber', width: '17%', className: '' }),
  Map({ header: 'case', label: 'case', width: '17%', className: '' }),
  Map({ header: 'weight', label: 'weight', width: '8%', className: '' }),
]);

function getTypeName(wasteInitial) {
  switch (wasteInitial.toUpperCase()) {
    case 'P':
      return 'Production';
    case 'W':
      return 'Waste';
    case 'Z':
      return 'Transition';
    default:
      return 'Other';
  }
}

function getYap100Data(data, parent) {
  return data.filter(row => (
    row.get('machine').toLowerCase() === parent.get('name').toLowerCase()
  ));
}

function formatYap100List(yap100List) {
  return yap100List.map((row) => {
    const time = moment(row.get('timestamp')).format('MM/DD/YY HH:mm');
    const typeName = getTypeName(row.get('transactionType'));
    return row.set('timestamp', time).set('transactionType', typeName).delete('user')
                                                                      .delete('yarnColor')
                                                                      .delete('machine')
                                                                      .delete('subLot')
                                                                      .delete('merge');
  });
}

const Yap100List = ({ data, parent }) => {
  if (!data || !data.get('yap100_list') || !parent) {
    return <Loader />;
  }
  const tableData = getYap100Data(data.get('yap100_list'), parent);
  return (
    <div id="yap100__container">
      <FilterTable
        className="processlog__filter-table"
        tableData={formatYap100List(tableData)}
        rowMap={rowMap}
        csv
        filter
        results
      />
      <div style={{ float: 'right'}}>Note: Times use AS400 times - midnight to 7am is still considered the previous day</div>
    </div>
  );
};


Yap100List.propTypes = {
  data: PropTypes.object,
  parent: PropTypes.object.isRequired,
};

export default Yap100List;
