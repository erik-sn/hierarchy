import { List, Map } from 'immutable';
import * as moment from 'moment';
import * as React from 'react';

import {
  IBaseModule,
  IConfig,
  IDepartment,
  IHierarchyTier,
  IMachine,
} from '../../../../src/constants/interfaces';
import Loader from '../../loader';
import PieTable from '../pie_table';

const config: IConfig[] = [
  { header: 'Date', label: 'date', width: '25%' },
  { header: 'Machine', label: 'line', width: '25%' },
  { header: 'Product', label: 'keyword', width: '25%' },
  { header: 'Box Weight', label: 'value', width: '25%' },
];

export function setMachineInList(list: List<Map<string, any>>, type: string, parent: IDepartment | IMachine) {
  let machines: IMachine[];
  if (type === 'department') {
    machines = (parent as IDepartment).machines;
    return list.map((p) => (
      p.set('line', machines.find((m) => m.id === p.get('machine')).name,
    )));
  } else {
    return list.filter((p) => p.get('machine') === parent.id)
               .map((p) => p.set('line', parent.name));
  }

}

export function formatProduction(list: List<Map<string, any>>): List<Map<string, any>> {
  return list.map((p) => (
    p.set('date', moment(p.get('created')).format('HH:mm'))
     .set('created', moment(p.get('created')))
     .set('value', p.get('value').toFixed(1))
  )).sort((a, b) => a.get('created') > b.get('created') ? 1 : -1);
}

export function parseProductionPieData(production: List<Map<string, any>>): List<{}> {
  const pieChart = production.reduce((map, cur) => {
    const product = cur.get('keyword');
    if (map.has(product)) {
      return map.set(product, map.get(product).push(cur));
    } else {
      return map.set(product, List([cur]));
    }
  }, Map<string, List<any>>({}));
  return pieChart.map((list, name) => ({ name, value: list.size })).toList();
}

const SampleProduction = ({ parent, departmentDataStore, type }: IBaseModule) => {
  if (!departmentDataStore || !departmentDataStore.get('procProduction')) {
    return <Loader />;
  }

  // get a list of available machines
  let production = departmentDataStore.get('procProduction');
  production = setMachineInList(production, type, parent);
  production = formatProduction(production);

  // pie chart
  const pieData = parseProductionPieData(production);

  return (
    <div className="sample__production__container" >
      <PieTable
        pieData={pieData}
        tableData={production}
        tableConfig={config}
        pieHeader="Boxes By Product"
        tableHeader="Product Packaging Time & Weight"
      />
    </div>
  );
};

export default SampleProduction;
