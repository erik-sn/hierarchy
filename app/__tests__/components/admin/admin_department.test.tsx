import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as moxios from 'moxios';
import * as React from 'react';
import * as sinon from 'sinon';

import Department from '../../../src/components/admin/admin_department';
import { IDepartment, ISite } from '../../../src/constants/interfaces';

const siteList: ISite[] = require('../../sites.json');

describe('admin_department.test.tsx |', () => {
  const department = siteList[0].departments[0];
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let message: sinon.SinonSpy;
    let fetchHierarchy: sinon.SinonSpy;
    const props = {
      site: siteList[0],
      modules: department.modules,
    };

    beforeEach(() => {
      moxios.install();
      message = sinon.spy();
      fetchHierarchy = sinon.spy();
      const spies: any = { message, fetchHierarchy };
      component = shallow(<Department {...props} {...spies} />);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__department-container')).to.have.length(1);
    });

    it('has the correct elements', () => {
      expect(component.find('SelectField')).to.have.length(1);
      expect(component.find('MenuItem')).to.have.length(2);
      expect(component.find('FlatButton')).to.have.length(1);
    });

    it('opens a modal with the department form on add department click', () => {
      component.find('FlatButton').simulate('click');
      expect(component.find('Connect(Component)')).to.have.length(1);
      expect(component.find('Connect(Component)').props().title).to.equal('Create New Department');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });

    it('closes modal on cancel click', () => {
      component.find('FlatButton').simulate('click');
      const modal: any = component.find('Connect(Component)').props();
      const cancel: any = modal.onCancel;
      cancel();
      component.setState({ showNewDepartment: false });
      expect(component.find('Connect(Modal)')).to.have.length(0);
    });

    it('set the menu items value in the select box and show the department form', () => {
      component.find('MenuItem').first().simulate('TouchTap');
      expect(component.find('SelectField').props().value).to.equal('Extrusion');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
      expect(component.find('FlatButton')).to.have.length(0);
    });

    it('alters the state correctly on successful createDepartment call', (done) => {
      const instance: any = component.instance();
      instance.createDepartment({ name: 'test' });
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: department,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Department Successfully Created: test');
          expect(fetchHierarchy.callCount).to.equal(1);
          done();
        });
      });
    });

    it('calls message with an error message on createDepartment fail', (done) => {
      const instance: any = component.instance();
      instance.createDepartment({ name: 'test' });
      instance.createDepartment({ name: 'test' });
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Error Creating Department: test');
          expect(fetchHierarchy.callCount).to.equal(0);
          done();
        });
      });
    });

    it('alters the state correctly on successful updateDepartment call', (done) => {
      component.setState({ department });
      const instance: any = component.instance();
      instance.updateDepartment({ name: 'test' });
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: department,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Department Successfully Updated: test');
          expect(fetchHierarchy.callCount).to.equal(1);
          const state: any = component.state();
          expect(state.department).to.equal(undefined);
          done();
        });
      });
    });

    it('calls message with an error message on updateDepartment fail', (done) => {
      component.setState({ department });
      const instance: any = component.instance();
      instance.updateDepartment({ name: 'test' });
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Error Updating Department: test');
          expect(fetchHierarchy.callCount).to.equal(0);
          const state: any = component.state();
          expect(state.department).to.equal(undefined);
          done();
        });
      });
    });
  });
});
