
import { List, Map } from 'immutable';
import * as React from 'react';

import { IConfig } from '../../constants/interfaces';
import PieChart from '../charts/pie_chart';
import FilterTable from '../utility/filter_table/filter_table';

interface IPieListProps {
  pieData: List<{}>;
  tableData: List<Map<string, any>>;
  tableConfig: IConfig[];
  pieHeader: string;
  tableHeader: string;
}

const PieTable = ({ pieData, tableData, tableConfig, pieHeader, tableHeader }: IPieListProps) => (
  <div className="sample__pielist__container" >
    <div className="pielist__pie">
      <h3>{pieHeader}</h3>
      <PieChart
        chartData={pieData.toJS()}
        height={400}
        width={500}
        innerRadius={75}
        outerRadius={120}
      />
    </div>
    <div className="pielist__table">
      <h3>{tableHeader}</h3>
      <FilterTable
        className="pielist__filter-table"
        tableData={tableData.toJS()}
        config={tableConfig}
        showCsv
        showFilter
        showResults
      />
    </div>
  </div>
);

export default PieTable;
