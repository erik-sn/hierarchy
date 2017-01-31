import * as moment from 'moment';
import * as React from 'react';

const appConfig = require('../../../appconfig.json');

import { IDictionary } from '../../../constants/interfaces';
import Csv from '../../csv_generator';

interface IParam {
  header: string;
  label: string;
}

export interface ITableCsvProps {
  tableData: Array<IDictionary<any>>;
  config: IParam[];
}

const TableCsv = ({ tableData, config }: ITableCsvProps) => (
  <div className="filter_table__csv-container">
    <Csv
      fileName={`${appConfig.name}_${moment().format('MMDDYY-HHmm')}`}
      data={tableData}
      params={config}
    />
    <div className="tooltip__text">Download CSV</div>
  </div>
);

export default TableCsv;

