import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import sinon from 'sinon';

import AdminSite from '../../../src/components/admin/admin_site';
import { sites } from '../../../__test__/sample';

describe('admin_tabs.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  describe('Default | >>>', () => {
    let component;
    let navigate;
    const props = {
      site: hierarchy.get(3),
      splat: '/ox/',
    };

    beforeEach(() => {
      navigate = sinon.spy();
      component = shallow(<AdminSite {...props} navigate={navigate} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__site-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('CardTitle')).to.have.length(1);
      expect(component.find('List')).to.have.length(1);
      expect(component.find('ListItem')).to.have.length(3);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
      expect(component.find('.admin__site-content-')).to.have.length(1);
    });

    it('3. calls navigate on site-options click', () => {
      expect(navigate.callCount).to.equal(0);
      component.find('ListItem').at(0).simulate('click');
      component.find('ListItem').at(1).simulate('click');
      component.find('ListItem').at(2).simulate('click');
      expect(navigate.callCount).to.equal(3);
    });
  });

  describe('Departments | >>>', () => {
    let component;
    let navigate;
    const props = {
      site: hierarchy.get(3),
      splat: '/ox/departments',
    };

    beforeEach(() => {
      navigate = sinon.spy();
      component = shallow(<AdminSite {...props} navigate={navigate} />);
    });

    it('1. renders a department screen', () => {
      expect(component.find('.admin__site-content-departments')).to.have.length(1);
    });
  });

  describe('Machines | >>>', () => {
    let component;
    let navigate;
    const props = {
      site: hierarchy.get(3),
      splat: '/ox/machines',
    };

    beforeEach(() => {
      navigate = sinon.spy();
      component = shallow(<AdminSite {...props} navigate={navigate} />);
    });

    it('1. renders a department screen', () => {
      expect(component.find('.admin__site-content-machines')).to.have.length(1);
    });
  });
});
