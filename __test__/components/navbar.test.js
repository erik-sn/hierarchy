import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { fromJS, Map } from 'immutable';

import Navbar from '../../src/components/navbar';
import { sites } from '../../__test__/sample';
import { resolvePath } from '../../src/utils/resolver';
import { mountWithTheme } from '../helper';

const data = fromJS(JSON.parse(sites));

describe('navbar.test.js |', () => {
  describe('Expected | >>>', () => {
    let component;
    const props = {
      user: Map({ username: 'test_user', ip: '0.0.0.0' }),
      hierarchy: resolvePath(data, '/ox/extrusion/ox11'),
      path: '/ox/extrusion/ox11',
    };

    beforeEach(() => {
      component = shallow(<Navbar {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.exist();
      expect(component.find('.navbar__icon-container')).to.have.length(1);
      expect(component.find('.navbar__app-label')).to.have.length(1);
      expect(component.find('.navbar__hierarchy-container')).to.have.length(1);
      expect(component.find('.navbar__info-container')).to.have.length(1);
      expect(component.find('.navbar__username')).to.have.length(1);
      expect(component.find('.navbar__settings')).to.have.length(1);
    });

    it('2. displays the correct user', () => {
      expect(component.find('.navbar__username').text()).to.equal('test_user');
    });

    it('3. should have three hierarchy items', () => {
      expect(component.find('.navbar__hierarchy-item-parent')).to.have.length(3);
    });

    it('4. hierarchy items should have the correct values', () => {
      const items = component.find('.navbar__hierarchy-item-child');
      expect(items.at(0).text()).to.equal('');
      expect(items.at(1).text()).to.equal('Oak River');
      expect(items.at(2).text()).to.equal('Extrusion');
      expect(items.at(3).text()).to.equal('OX11');
    });
  });

  describe('User Error | >>>', () => {
    let component;
    const props = {
      user: Map({ username: undefined, ip: undefined }),
      error: true,
      hierarchy: resolvePath(data, '/ox/extrusion/ox11')
    };

    beforeEach(() => {
      component = shallow(<Navbar {...props} />, {});
    });

    it('1. displays unavailable if the user is undefined', () => {
      expect(component.find('.navbar__username').text()).to.equal('');
    });
  });

  describe('No Hierarchy | >>>', () => {
    let component;
    const props = {
      user: Map({ username: 'hello', ip: undefined }),
      error: false,
      hierarchy: undefined,
      path: '/'
    };

    beforeEach(() => {
      component = shallow(<Navbar {...props} />);
    });

    it('1. shows no hierarchy items if no hierarchy is present', () => {
      expect(component.find('.navbar__hierarchy-item-parent')).to.have.length(0);
    });
  });
});
