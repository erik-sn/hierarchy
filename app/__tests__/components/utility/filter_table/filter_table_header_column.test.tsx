import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import Header, { IHeaderColumnProps } from '../../../../src/components/utility/filter_table/filter_table_header_column';
import { IDictionary } from '../../../../src/constants/interfaces';


describe('filter_table_header_column.test.tsx |', () => {
  describe('label !== sortParameter', () => {
    let component: ShallowWrapper<{}, {}>;
    let handleClick: sinon.SinonSpy;
    const props: IHeaderColumnProps = {
      option: {
        width: '200px',
        header: 'name',
        label: 'Name',
        transform: undefined,
      },
      sortParameter: undefined,
      sortDirection: 1,
      handleClick: undefined,
    };

    beforeEach(() => {
      handleClick = sinon.spy();
      component = shallow(<Header {...props} handleClick={handleClick} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.filter_table__header-cell').length).to.equal(1);
      expect(component.find('.filter_table__header-cell-label').length).to.equal(1);
      expect(component.find('.filter_table__header-cell-icon').length).to.equal(1);
    });

    it('contains have the correct values', () => {
      expect(component.find('.filter_table__header-cell').text()).to.equal(props.option.header);
      expect(component.find('filter_table__header-cell-icon').children()).to.have.length(0);
  });

    it('calls handleClick div click', () => {
      component.find('.filter_table__header-cell').simulate('click');
      expect(handleClick.callCount).to.equal(1);
    });
  });

  describe('label === sortParameter, sort direction 1', () => {
    let component: ShallowWrapper<{}, {}>;
    let handleClick: sinon.SinonSpy;
    const props: IHeaderColumnProps = {
      option: {
        width: '200px',
        header: 'name',
        label: 'Name',
        transform: undefined,
      },
      sortParameter: 'Name',
      sortDirection: 1,
      handleClick: undefined,
    };

    beforeEach(() => {
      handleClick = sinon.spy();
      component = shallow(<Header {...props} handleClick={handleClick} />);
    });

    it('has up arrow icon', () => {
      const container = component.find('.filter_table__header-cell-icon');
      expect(container.find('NavigationArrowDropUp').length).to.equal(1);
    });
  });

  describe('label === sortParameter, sort direction -1', () => {
    let component: ShallowWrapper<{}, {}>;
    let handleClick: sinon.SinonSpy;
    const props: IHeaderColumnProps = {
      option: {
        width: '200px',
        header: 'name',
        label: 'Name',
        transform: undefined,
      },
      sortParameter: 'Name',
      sortDirection: -1,
      handleClick: undefined,
    };

    beforeEach(() => {
      handleClick = sinon.spy();
      component = shallow(<Header {...props} handleClick={handleClick} />);
    });

    it('has up arrow icon', () => {
      const container = component.find('.filter_table__header-cell-icon');
      expect(container.find('NavigationArrowDropDown').length).to.equal(1);
    });
  });

  describe('childrenClass defined', () => {
    let component: ShallowWrapper<{}, {}>;
    let handleClick: sinon.SinonSpy;
    const props: IHeaderColumnProps = {
      option: {
        width: '200px',
        header: 'name',
        label: 'Name',
        transform: undefined,
        childrenClass: 'test_class',
      },
      sortParameter: 'Name',
      sortDirection: -1,
      handleClick: undefined,
    };

    beforeEach(() => {
      handleClick = sinon.spy();
      component = shallow(<Header {...props} handleClick={handleClick} />);
    });

    it('children class was passed to containers className', () => {
      expect(component.find('.test_class').length).to.equal(1);
    });
  });
});
