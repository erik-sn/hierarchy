import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS, Map } from 'immutable';
import moxios from 'moxios';
import sinon from 'sinon';

import Department from '../../../src/components/admin/admin_department';
import { sites } from '../../../__test__/sample';

describe('admin_department.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  const department = hierarchy.get(3).get('departments').get(0);
  describe('Expected | >>>', () => {
    let component;
    let message;
    let fetchHierarchy;
    const props = {
      site: hierarchy.get(3),
      modules: ['module1', 'module2', 'module3'],
    };

    beforeEach(() => {
      moxios.install();
      message = sinon.spy();
      fetchHierarchy = sinon.spy();
      const spies = { message, fetchHierarchy };
      component = shallow(<Department {...props} {...spies} />);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__department-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('SelectField')).to.have.length(1);
      expect(component.find('MenuItem')).to.have.length(1);
      expect(component.find('FlatButton')).to.have.length(1);
    });

    it('3. opens a modal with the department form on add department click', () => {
      component.find('FlatButton').simulate('click');
      expect(component.find('Connect(Modal)')).to.have.length(1);
      expect(component.find('Connect(Modal)').props().title).to.equal('Create New Department');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });

    it('4. closes modal on cancel click', () => {
      component.find('FlatButton').simulate('click');
      const cancel = component.find('Connect(Modal)').props().onCancel;
      cancel();
      component.setState({ showNewDepartment: false });
      expect(component.find('Connect(Modal)')).to.have.length(0);
    });

    it('5. set the menu items value in the select box and show the department form', () => {
      component.find('MenuItem').simulate('click');
      expect(component.find('SelectField').props().value).to.equal('Extrusion');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
      expect(component.find('FlatButton')).to.have.length(0);
    });

    it('6. alters the state correctly on successful createDepartment call', (done) => {
      component.instance().createDepartment(Map({ name: 'test' }));
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

    it('7. calls message with an error message on createDepartment fail', (done) => {
      component.instance().createDepartment(Map({ name: 'test' }));
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

    it('8. alters the state correctly on successful updateDepartment call', (done) => {
      component.setState({ department });
      component.instance().updateDepartment(Map({ name: 'test' }));
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: department,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Department Successfully Updated: test');
          expect(fetchHierarchy.callCount).to.equal(1);
          expect(component.state().department).to.equal(undefined);
          done();
        });
      });
    });

    it('9. calls message with an error message on updateDepartment fail', (done) => {
      component.setState({ department });
      component.instance().updateDepartment(Map({ name: 'test' }));
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Error Updating Department: test');
          expect(fetchHierarchy.callCount).to.equal(0);
          expect(component.state().department).to.equal(undefined);
          done();
        });
      });
    });
  });
});
