import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import Cell, { ICellProps } from '../../../../src/components/utility/filter_table/filter_table_cell';
import { IDictionary } from '../../../../src/constants/interfaces';


describe('filter_table_cell.test.tsx |', () => {
  let component: ShallowWrapper<{}, {}>;
  let handleClick: sinon.SinonSpy;
  const props: ICellProps = {
    width: 200,
    value: 'testval',
    className: 'test_class',
    handleClick: undefined,
  };

  beforeEach(() => {
    handleClick = sinon.spy();
    component = shallow(<Cell {...props} handleClick={handleClick} />);
  });

  it('renders something & has correct containers', () => {
    expect(component).to.exist;
    expect(component.find('.filter_table__cell').length).to.equal(1);
  });

  it('contains the cell value', () => {
    expect(component.find('.filter_table__cell').text()).to.equal(props.value);
  });

  it('calls click handler on div click', () => {
    component.find('.filter_table__cell').simulate('click');
    expect(handleClick.callCount).to.equal(1);
  });
});
