import React, { PropTypes } from 'react';
import { List, Map } from 'immutable';

import Loader from '../../loader';
import FilterTable from '../../utility/filter_table/filter_table';
import { isMomentParameter } from '../../../utils/library';

// generic sum function, convert to number as we are mostly working with strings
const sum = (total, value) => total + Number(value);

// summing functions for each numeric column
const productionTransform = rowValues => rowValues.get('productionPounds').reduce(sum, 0);
const wasteTransform = rowValues => rowValues.get('wastePounds').reduce(sum, 0);
const transitionTransform = rowValues => rowValues.get('transitionPounds').reduce(sum, 0);

// group all sum columns into a single function
const totals = (rowValues) => {
  const production = productionTransform(rowValues);
  const waste = wasteTransform(rowValues);
  const transition = transitionTransform(rowValues);
  return { production, waste, transition };
};

/**
 * we need to manually calculate the percentages of the totals instead of
 * averaging the column values. Because throughputs are different we can
 * accidentally over value some lines by a straight average
 */
const wastePercentTransform = (rowValues) => {
  const { production, waste, transition } = totals(rowValues);
  return ((100 * waste) / (production + waste + transition)).toFixed(1);
};

// same deal as waste
const transitionPercentTransform = (rowValues) => {
  const { production, waste, transition } = totals(rowValues);
  return ((100 * transition) / (production + waste + transition)).toFixed(1);
};

const labelTransform = () => 'Total:';

const rowMap = List([
  Map({ header: 'Production', label: 'productionPounds', width: '20%', transform: productionTransform }),
  Map({ header: 'Waste lb', label: 'wastePounds', width: '20%', transform: wasteTransform }),
  Map({ header: '%', label: 'wastePercent', width: '8%', transform: wastePercentTransform }),
  Map({ header: 'Trans. lb', label: 'transitionPounds', width: '20%', transform: transitionTransform }),
  Map({ header: '%', label: 'transitionPercent', width: '8%', transform: transitionPercentTransform, childrenClass: 'filter__table_column-center' }),
]);

function buildRowHeader(header, label, width, className = '', childrenClass = '') {
  return Map({ header, label, width, className, childrenClass });
}

function formatMomentHeader(formattedRowMap, containsShift) {
  const datePercent = containsShift ? '10%' : '20%';
  return buildRowHeader('Date', 'label', datePercent, '', 'filter__table_column-center');
}

function buildRowMap(data) {
  const containsShift = data.get(0).get('shift');
  let formattedRowMap = rowMap.slice(0);

  if (containsShift) {
    const shiftHeader = buildRowHeader('Shift', 'shift', '10%', '', 'filter__table_column-center');
    formattedRowMap = formattedRowMap.insert(0, shiftHeader);
  }
  if (isMomentParameter(data, 'label')) {
    let dateHeader = formatMomentHeader(formattedRowMap, containsShift);
    dateHeader = dateHeader.set('transform', labelTransform);
    formattedRowMap = formattedRowMap.insert(0, dateHeader);
  } else {
    let labelHeader = buildRowHeader('Label', 'label', '20%');
    labelHeader = labelHeader.set('transform', labelTransform);
    formattedRowMap = formattedRowMap.insert(0, labelHeader);
  }
  return formattedRowMap;
}

const Start = () => (
  <div className="ewa__table-container">
    <h3>Select filters and press "Search"</h3>
  </div>
);

const Empty = () => (
  <div className="ewa__table-container">
    <h3>No Data</h3>
  </div>
);

const TableDisplay = ({ data }) => {
  if (!data) {
    return <Start />;   
  }
  if (data.size === 0) {
    return <Empty />;
  }
  const formattedRowMap = buildRowMap(data);

  return (
    <div className="ewa__table-container" >
      <FilterTable
        className="ewa__table-filter-table"
        rowMap={formattedRowMap}
        tableData={data}
        csv
        filter
        totals
        results
      />
    </div>
  );
};

TableDisplay.propTypes = {
  data: PropTypes.object,
};

export default TableDisplay;
