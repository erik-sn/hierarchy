import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import Filter, { IFilterProps } from '../../../../src/components/utility/filter_table/filter_table_filter';
import { IDictionary } from '../../../../src/constants/interfaces';


describe('filter_table_filter.test.tsx |', () => {
  describe('filterAny === true', () => {
    let component: ShallowWrapper<{}, {}>;
    let updateFilter: sinon.SinonSpy;
    const props: IFilterProps = {
      filterAny: true,
      updateFilter: undefined,
    };

    beforeEach(() => {
      updateFilter = sinon.spy();
      component = shallow(<Filter {...props} updateFilter={updateFilter} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('TextField').length).to.equal(1);
    });

    it('has the correct hint label (any)', () => {
      const textFieldProps: any = component.find('TextField').props();
      expect(textFieldProps.hintText).to.contain('matching any filter');
    });

    it('calls updateFilter on text field change', () => {
      const prevent: sinon.SinonSpy = sinon.spy();
      const event: any = {
        preventDefault: prevent,
        currentTarget: {
          value: 'test',
        },
      };
      component.find('TextField').simulate('change', event);
      expect(prevent.callCount).to.equal(1);
    });
  });

  describe('filterAny === false', () => {
    let component: ShallowWrapper<{}, {}>;
    let updateFilter: sinon.SinonSpy;
    const props: IFilterProps = {
      filterAny: false,
      updateFilter: undefined,
    };

    beforeEach(() => {
      updateFilter = sinon.spy();
      component = shallow(<Filter {...props} updateFilter={updateFilter} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('TextField').length).to.equal(1);
    });

    it('has the correct hint label (all)', () => {
      const textFieldProps: any = component.find('TextField').props();
      expect(textFieldProps.hintText).to.contain('matching all filters');
    });
  });


  describe('updateFilter undefined', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IFilterProps = {
      filterAny: false,
      updateFilter: undefined,
    };

    beforeEach(() => {
      component = shallow(<Filter {...props} />);
    });

    it('does not error if updateFilter is not defined', () => {
      const prevent: sinon.SinonSpy = sinon.spy();
      const event: any = {
        preventDefault: prevent,
        currentTarget: {
          value: 'test',
        },
      };
      component.find('TextField').simulate('change', event);
    });
  });
});
