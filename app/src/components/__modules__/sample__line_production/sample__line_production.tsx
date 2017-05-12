/**
 * Module Created: 2017-05-12 14:47:51 -04:00
 * Author: NiehausE
 */
import * as moment from 'moment';
import * as React from 'react';
import { List, Map } from 'immutable';

import { IHierarchyTier, IBaseModule,
  IConfig, 
  IDepartment,
  IMachine} from '../../../../src/constants/interfaces';
import FilterTable from '../../utility/filter_table/filter_table'

export interface IProps extends IBaseModule {
}


const config: IConfig[] = [
  { header: 'Date', label: 'date', width: '20%' },
  { header: 'Machine', label: 'line', width: '20%' },
  { header: 'Product', label: 'keyword', width: '20%' },
  { header: 'Box Weight', label: 'value', width: '25%' },
];

const SampleProduction = ({ parent, departmentDataStore, type }: IProps) => {
  if (!departmentDataStore || !departmentDataStore.get('procProduction')) {
    return <div>Loading</div>;
  }

  // get a list of available machines
  let machines: IMachine[];
  if (type === 'department') {
    machines = (parent as IDepartment).machines;
  } else {
    machines = [parent as IMachine]
  }

  // format production data for table
  const production = departmentDataStore.get('procProduction').map((p) => (
    p.set('date', moment(p.get('created')).format('HH:mm'))
     .set('created', moment(p.get('created')))
     .set('line', machines.find(m => m.id === p.get('machine')).name)
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
  }, Map<string, List<any>>({}))


  return (
    <div className="sample__production__container" >
      <div className="production__pie">
        <h3>Products Count</h3>
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
}

export default SampleProduction;
