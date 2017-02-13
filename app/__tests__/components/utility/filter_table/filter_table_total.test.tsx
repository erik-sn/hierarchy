import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import TableTotal, { ITotalProps } from '../../../../src/components/utility/filter_table/filter_table_total';
import { IDictionary } from '../../../../src/constants/interfaces';
import { mountWithTheme } from '../../../helper';


describe('filter_table_row.test.tsx |', () => {
  const sum = (total: number, value: string) => total + Number(value.replace(/,/g, ''));
  const transform = (rowValues: IDictionary<any>, label: string) => (
    rowValues[label].reduce(sum, 0)
  );
  const props: ITotalProps = {
    config: [
      {
        header: 'Name',
        label: 'name',
        width: '200px',
        transform: undefined,
      },
      {
        header: 'Value',
        label: 'value',
        width: '300px',
        transform,
      },
    ],
    tableData: [
        {
        name: 'one',
        value: '1',
        },
        {
        name: 'two',
        value: '2',
        },
    ],
  };
  let component: ShallowWrapper<{}, {}>;
  beforeEach(() => {
    component = shallow(<TableTotal {...props} />);
  });

  it('renders something & has correct containers', () => {
    expect(component).to.exist;
    expect(component.find('.filter_table__totals-container').length).to.equal(1);
  });

  it('has the correct values for totals', () => {
    const rowProps: any = component.find('Row').props();
    expect(rowProps.rowData.name).to.equal('');
    expect(rowProps.rowData.value).to.equal(3);
  });
});
