import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import FilterCsv, { ITableCsvProps, ITableHeader } from '../../../../src/components/utility/filter_table/filter_csv';
import { IDictionary } from '../../../../src/constants/interfaces';

const tableData: Array<IDictionary<any>> = [
  { name: 'one', test: '1'},
  { name: 'two', test: '2'},
  { name: 'three', test: '3'},
  { name: 'four', test: '4'},
];

const tableHeaders: ITableHeader[] = [
  { header: 'name', label: 'Name'},
  { header: 'test', label: 'Test'},
];

describe('filter_csv.test.tsx |', () => {
  let component: ShallowWrapper<{}, {}>;
  const props: ITableCsvProps = {
    tableData,
    tableHeaders,
  };

  beforeEach(() => {
    component = shallow(<FilterCsv {...props} />);
  });

  it('renders something & has correct containers', () => {
    expect(component).to.exist;
    expect(component.find('.filter_table__csv-container').length).to.equal(1);
    expect(component.find('.tooltip__text').length).to.equal(1);
  });

  it('contains a Csv element', () => {
    expect(component.find('CsvGenerator').length).to.equal(1);
  });
});
