import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import Dropdown, { INavDropdownProps } from '../../../src/components/navbar/navbar_dropdown';

describe('navbar_dropdown.test.tsx |', () => {
  describe('Default | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: INavDropdownProps = {
      style: {
        left: '20px',
        top: '15px',
      },
      neighbors: [
        <div className="test__class" key={1}>one</div>,
        <div className="test__class" key={2}>two</div>,
        <div className="test__class" key={3}>three</div>,
      ],
    };

    beforeEach(() => {
      component = shallow(<Dropdown {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.navbar__neighbor-container')).to.have.length(1);
      expect(component.find('.navbar__neighbor-list')).to.have.length(1);
    });

    it('has all the neighbors in a list', () => {
      expect(component.find('.test__class')).to.have.length(3);
    });
  });
});
