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
import PieChart from '../../charts/pie_chart';
import FilterTable from '../../utility/filter_table/filter_table';

const config: IConfig[] = [
  { header: 'Date', label: 'date', width: '25%' },
  { header: 'Machine', label: 'line', width: '25%' },
  { header: 'Product', label: 'keyword', width: '25%' },
  { header: 'Box Weight', label: 'value', width: '25%' },
];

const SampleProduction = ({ parent, departmentDataStore, type }: IBaseModule) => {
  if (!departmentDataStore || !departmentDataStore.get('procProduction')) {
    return <div>Loading</div>;
  }

  // get a list of available machines
  let production = departmentDataStore.get('procProduction');
  let machines: IMachine[];
  if (type === 'department') {
    machines = (parent as IDepartment).machines;
    production = production.map((p) => (
      p.set('line', machines.find((m) => m.id === p.get('machine')).name
    )));
  } else {
    production = production
                  .filter((p) => p.get('machine') === parent.id)
                  .map((p) => p.set('line', parent.name));
  }

  // format production data for table
  production = production.map((p) => (
    p.set('date', moment(p.get('created')).format('HH:mm'))
     .set('created', moment(p.get('created')))
     .set('value', p.get('value').toFixed(1))
  )).sort((a, b) => a.get('created') > b.get('created') ? 1 : -1);

  // pie chart
  const pieChart = production.reduce((map, cur) => {
    const product = cur.get('keyword');
    if (map.has(product)) {
      return map.set(product, map.get(product).push(cur));
    } else {
      return map.set(product, List([cur]));
    }
  }, Map<string, List<any>>({}));
  const pieData = pieChart.map((list, name) => ({ name, value: list.size })).toList();

  return (
    <div className="sample__production__container" >
      <div className="production__pie">
        <h3>Boxes By Product</h3>
        <PieChart chartData={pieData.toJS()} height={225}/>
      </div>
      <div className="production__table">
        <h3>Product Packaging Time & Weight</h3>
        <FilterTable
          className="processlog__filter-table"
          tableData={production.toJS()}
          config={config}
          showCsv
          showFilter
          showResults
        />
      </div>
    </div>
  );
};

export default SampleProduction;
