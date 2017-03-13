import * as moment from 'moment';
import * as React from 'react';

const appConfig = require('../../../../appconfig.json');

import { IDictionary } from '../../../constants/interfaces';
import Csv from '../../csv_generator';

export interface ITableHeader {
  header: string;
  label: string;
}

export interface ITableCsvProps {
  tableData: Array<IDictionary<any>>;
  tableHeaders: ITableHeader[];
}

const TableCsv = ({ tableData, tableHeaders }: ITableCsvProps) => (
  <div className="filter_table__csv-container">
    <Csv
      fileName={`${appConfig.name}_${moment().format('MMDDYY-HHmm')}`}
      data={tableData}
      params={tableHeaders}
      showTooltip
    />
  </div>
);

export default TableCsv;
