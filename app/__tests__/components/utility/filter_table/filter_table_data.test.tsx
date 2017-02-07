import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import TableData, { ITableDataProps } from '../../../../src/components/utility/filter_table/filter_table_data';


describe('filter_table_data.test.tsx |', () => {
  let handleRowClick: sinon.SinonSpy;
  const props: ITableDataProps = {
    handleRowClick: undefined,
    config: [
      {
        header: 'Name',
        label: 'name',
        width: 200,
        transform: undefined,
      },
      {
        header: 'Value',
        label: 'value',
        width: 300,
        transform: undefined,
      },
    ],
    finalTableData: [
        {
        name: 'one',
        value: '1',
        },
        {
        name: 'two',
        value: '2',
        },
        {
        name: 'three',
        value: '3',
        },
        {
        name: 'four',
        value: '4',
        },
    ],
  };
  let component: ShallowWrapper<{}, {}>;
  beforeEach(() => {
    handleRowClick = sinon.spy();
    component = shallow(<TableData {...props} handleRowClick={handleRowClick} />);
  });

  it('renders something & has correct containers', () => {
    expect(component).to.exist;
    expect(component.find('.filter_table__row-container').length).to.equal(1);
  });

  it('should have 4 rows in an Infinite component', () => {
    expect(component.find('Infinite').length).to.equal(1);
    expect(component.find('Infinite').find('Row').length).to.equal(4);
  });
});
