import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import Neighbor, { INeighborProps } from '../../../src/components/navbar/navbar_neighbor';

describe('navbar_neighbor.test.tsx |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let hide: sinon.SinonSpy;
    const props: INeighborProps = {
      path: '/test',
      name: 'atl',
      hide: undefined,
    };

    beforeEach(() => {
      hide = sinon.spy();
      component = shallow(<Neighbor {...props} hide={hide} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.host__label-small')).to.have.length(1);
      expect(component.find('.navbar__neighbor-item')).to.have.length(1);
    });

    it('container has the name label', () => {
      expect(component.find('.navbar__neighbor-item').text()).to.equal(props.name);
    });

    it('link has a to property to the path + name', () => {
      expect(component.find('Link')).to.have.length(1);
      expect(component.find('Link').props().to).to.equal('/atl');
    });

    it('calls hide on Link click', () => {
      component.find('Link').simulate('click');
      expect(hide.callCount).to.equal(1);
    });
  });

  describe('Module in Path | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let hide: sinon.SinonSpy;
    const props: INeighborProps = {
      path: '/test/m/helloworld',
      name: 'atl',
      hide: undefined,
    };

    beforeEach(() => {
      hide = sinon.spy();
      component = shallow(<Neighbor {...props} hide={hide} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.host__label-small')).to.have.length(1);
      expect(component.find('.navbar__neighbor-item')).to.have.length(1);
    });
  });

  describe('Path undefined | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let hide: sinon.SinonSpy;
    const props: INeighborProps = {
      path: undefined,
      name: 'atl',
      hide: undefined,
    };

    beforeEach(() => {
      hide = sinon.spy();
      component = shallow(<Neighbor {...props} hide={hide} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.host__label-small')).to.have.length(1);
      expect(component.find('.navbar__neighbor-item')).to.have.length(1);
    });
  });
});
