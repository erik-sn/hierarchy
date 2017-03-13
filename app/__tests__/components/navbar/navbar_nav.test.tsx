import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import Nav, { INavbarNavProps } from '../../../src/components/navbar/navbar_nav';

describe('navbar_nav.test.tsx |', () => {
  describe('Not Active | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let handleClick: sinon.SinonSpy;
    const props: INavbarNavProps = {
      to: '/atl',
      name: 'atl',
      handleClick: undefined,
      active: false,
    };

    beforeEach(() => {
      handleClick = sinon.spy();
      component = shallow(<Nav {...props} handleClick={handleClick} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.navbar__hierarchy-item-parent')).to.have.length(1);
    });

    it('contains the nav name inside the child container', () => {
      expect(component.find('.navbar__hierarchy-item-child').text()).to.equal(props.name);
    });

    it('calls handle click on link click', () => {
      component.find('.navbar__hierarchy-item-parent').simulate('click');
      expect(handleClick.callCount).to.equal(1);
    });
  });

  describe('Active | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let handleClick: sinon.SinonSpy;
    const props: INavbarNavProps = {
      to: '/atl',
      name: 'atl',
      handleClick: undefined,
      active: true,
    };

    beforeEach(() => {
      handleClick = sinon.spy();
      component = shallow(<Nav {...props} handleClick={handleClick} />);
    });

    it('has the last/active container', () => {
      expect(component.find('.navbar__hierarchy-item-last')).to.have.length(1);
    });
  });
});
