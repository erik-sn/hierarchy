/**
 * Module Created: 2017-05-13 12:52:45 -04:00
 * Author: erik
 */
import { List, Map } from 'immutable';
import * as React from 'react';

import { IBaseModule, IConfig } from '../../../../src/constants/interfaces';
import Loader from '../../loader';
import PieTable from '../pie_table';
import {
  formatProduction,
  setMachineInList,
} from '../sample__line_production/sample__line_production';

const config: IConfig[] = [
  { header: 'Date', label: 'date', width: '25%' },
  { header: 'Machine', label: 'line', width: '25%' },
  { header: 'Product', label: 'keyword', width: '25%' },
  { header: 'Weight', label: 'value', width: '25%' },
];

export function parseScrapPieData(production: List<Map<string, any>>): List<{}> {
  const pieChart = production.reduce((map, cur) => {
    const product = cur.get('keyword');
    if (map.has(product)) {
      return map.set(product, map.get(product) + parseFloat(cur.get('value')));
    } else {
      return map.set(product, parseFloat(cur.get('value')));
    }
  }, Map<string, number>({}));
  return pieChart.map((value, name) => ({ name, value: Math.round(value) })).toList();
}

const SampleLineScrap = ({ departmentDataStore, type, parent }: IBaseModule) => {
  if (!departmentDataStore || !departmentDataStore.get('procScrap')) {
    return <Loader />;
  }

  // get a list of available machines
  let scrap = departmentDataStore.get('procScrap');
  scrap = setMachineInList(scrap, type, parent);
  scrap = formatProduction(scrap);

  // pie chart
  const pieData = parseScrapPieData(scrap);
  return (
    <div className="sample__line_scrap__container" >
      <PieTable
        pieData={pieData}
        tableData={scrap}
        tableConfig={config}
        pieHeader="Scrap Pounds By Product"
        tableHeader="Scrap Generation By Time & Weight"
      />
    </div>
  );
};

export default SampleLineScrap;
