import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import FilterToggle, { IFilterToggleProps } from '../../../../src/components/utility/filter_table/filter_toggle';


describe('filter_table_row.test.tsx |', () => {
  describe('filterAny === true', () => {
    let handleClick: sinon.SinonSpy;
    const props: IFilterToggleProps = {
      handleClick: undefined,
      filterAny: true,
    };
    let component: ShallowWrapper<{}, {}>;
    beforeEach(() => {
      handleClick = sinon.spy();
      component = shallow(<FilterToggle {...props} handleClick={handleClick} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.filter_table__mode-container').length).to.equal(1);
      expect(component.find('.tooltip').length).to.equal(1);
    });

    it('has an all icon when filterAny is true', () => {
      expect(component.find('CommunicationClearAll').length).to.equal(1);
    });

    it('calls handleClick on container click', () => {
      component.find('.filter_table__mode-container').simulate('click');
      expect(handleClick.callCount).to.equal(1);
    });
  });

  describe('filterAny === false', () => {
    let handleClick: sinon.SinonSpy;
    const props: IFilterToggleProps = {
      handleClick: undefined,
      filterAny: false,
    };
    let component: ShallowWrapper<{}, {}>;
    beforeEach(() => {
      handleClick = sinon.spy();
      component = shallow(<FilterToggle {...props} handleClick={handleClick} />);
    });

    it('has an any icon when filterAny is false', () => {
      expect(component.find('ContentFilterList').length).to.equal(1);
    });
  });
});
