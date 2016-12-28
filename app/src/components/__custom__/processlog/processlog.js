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
  { label: 'time', width: '15%', className: ''},
  { label: 'userName', width: '15%', className: ''},
  { label: 'description', width: '50%', className: ''},
  { label: 'oldValue', width: '10%', className: ''},
  { label: 'newValue', width: '10%', className: ''},
]

function getProcessLogData(data, parent) {
  return data.get('ox_processlog').filter(log => log.get('machine') === parent.get('name'));
}

function formatProcessLogs(processLogs) {
  return processLogs.map(log => {
    const time = moment(log.get('timestamp'));
    return log.set('time', time.format('MM/DD/YYY hh:mm')).set('className', 'processlog__row');
  });
}

const ProcessLog = props => {
  return <div>ASD;LKFJ</div>
}

  // if (!props.data || !props.data.get('ox_processlog') || !props.parent) {
  //   return <Loader />
  // }
  // const logs = getProcessLogData(props.data, props.parent);
  // return (
  //   <FilterTable
  //     className="processlog__filter-table"
  //     tableData={formatProcessLogs(logs)}
  //     rowMap={rowMap}
  //     csv
  //     filter
  //   />
  // );

ProcessLog.propTypes = {
  data: PropTypes.object.isRequired,
  parent: PropTypes.object.isRequired,
};

export default ProcessLog;
