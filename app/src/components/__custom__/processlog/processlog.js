/**
 * Module Created: 2016-12-04 10:25:41 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./processlog.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';
import moment from 'moment';

import Loader from '../../loader';
import FilterTable from '../../utility/filter_table/filter_table';

const rowMap = [
  { header: 'time', label: 'timestamp', width: '17%', className: '' },
  { header: 'user', label: 'userName', width: '22%', className: '' },
  { header: 'description', label: 'description', width: '45%', className: '' },
  { header: 'old', label: 'oldValue', width: '8%', className: '' },
  { header: 'new', label: 'newValue', width: '8%', className: '' },
];

function getProcessLogData(data, parent) {
  return data.get('ox_processlog').filter(log => log.get('machine') === parent.get('name'));
}

function formatProcessLogs(processLogs) {
  return processLogs.map((log) => {
    const time = moment(log.get('timestamp')).format('MM/DD/YY hh:mm');
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
    />
  );
};


ProcessLog.propTypes = {
  data: PropTypes.object,
  parent: PropTypes.object.isRequired,
};

export default ProcessLog;
