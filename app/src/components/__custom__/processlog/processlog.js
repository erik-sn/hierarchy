/**
 * Module Created: 2016-12-04 10:25:41 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./processlog.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';
import moment from 'moment';
import { List, Map } from 'immutable';

import Loader from '../../loader';
import FilterTable from '../../utility/filter_table/filter_table';

const rowMap = List([
  Map({ header: 'time', label: 'timestamp', width: '17%', className: '' }),
  Map({ header: 'user', label: 'userName', width: '22%', className: '' }),
  Map({ header: 'description', label: 'description', width: '45%', className: '' }),
  Map({ header: 'old', label: 'oldValue', width: '8%', className: '' }),
  Map({ header: 'new', label: 'newValue', width: '8%', className: '' }),
]);

function getProcessLogData(data, parent) {
  return data.get('ox_processlog').filter(log => log.get('machine') === parent.get('name'));
}

function formatProcessLogs(processLogs) {
  return processLogs.map((log) => {
    const time = moment(log.get('timestamp')).format('MM/DD/YY HH:mm');
    return log.set('timestamp', time).delete('id').delete('machine');
  });
}

const ProcessLog = ({ data, parent }) => {
  if (!data || !data.get('ox_processlog') || !parent) {
    return <Loader />;
  }
  const logs = getProcessLogData(data, parent);
  return (
    <FilterTable
      className="processlog__filter-table"
      tableData={formatProcessLogs(logs)}
      rowMap={rowMap}
      csv
      filter
      results
    />
  );
};


ProcessLog.propTypes = {
  data: PropTypes.object,
  parent: PropTypes.object.isRequired,
};

export default ProcessLog;
