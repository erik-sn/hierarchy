import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { is, fromJS, List, Map } from 'immutable';
import sinon from 'sinon';
import moxios from 'moxios';

import AdminSite from '../../../src/components/admin/admin_site';
import { sites } from '../../../__test__/sample';

describe('admin_site.test.js |', () => {
  const modules = List([
    Map({ name: 'module1', id: 1 }),
    Map({ name: 'module2', id: 2 }),
    Map({ name: 'module3', id: 3 }),
  ]);
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
      component.setState({ modules });
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__site-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('CardTitle')).to.have.length(1);
      expect(component.find('List')).to.have.length(1);
      expect(component.find('ListItem')).to.have.length(3);
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
      component.setState({ modules });
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
      component.setState({ modules });
    });

    it('1. renders a department screen', () => {
      expect(component.find('.admin__site-content-machines')).to.have.length(1);
    });
  });

  describe('Functions | >>>', () => {
    let component;
    let fetchHierarchy;
    const site = hierarchy.get(3);
    const props = {
      site,
      splat: '/ox/machines',
    };

    beforeEach(() => {
      moxios.install();
      fetchHierarchy = sinon.spy();
      component = shallow(<AdminSite {...props} fetchHierarchy={fetchHierarchy} />);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('1. populates modules on componentDidMount', (done) => {
      expect(component.state().modules).to.equal(undefined);
      component.instance().componentDidMount();
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 200,
          response: modules,
        }).then(() => {
          expect(is(component.state().modules, modules)).to.equal(true);
          done();
        });
      });
    });

    it('2. shows an error when modules fail to load', (done) => {
      expect(component.state().modules).to.equal(undefined);
      component.instance().componentDidMount();
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          expect(component.state().messageShow).to.equal(true);
          expect(component.state().messageText).to.equal('Error Loading Configuration Data');
          done();
        });
      });
    });

    it('3. correctly updates state to show message on successfull updateSite', (done) => {
      component.instance().updateSite(site);
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 200,
          response: site,
        }).then(() => {
          expect(fetchHierarchy.callCount).to.equal(1);
          expect(component.state().messageShow).to.equal(true);
          expect(component.state().messageText).to.equal(`Site Successfully Updated: ${site.get('name')}`);
          done();
        });
      });
    });

    it('4. shows an error message on fail', (done) => {
      component.instance().updateSite(site);
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 401,
          response: site,
        }).then(() => {
          expect(fetchHierarchy.callCount).to.equal(0);
          expect(component.state().messageShow).to.equal(true);
          expect(component.state().messageText).to.equal(`Error Updating Site: ${site.get('name')}`);
          done();
        });
      });
    });

    it('5. sets state correctly on handleMessageClose', () => {
      component.setState({ messageShow: true });
      component.instance().handleMessageClose();
      expect(component.state().messageShow).to.equal(false);
    });
  });
});
