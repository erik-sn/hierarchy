import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS, List, Map } from 'immutable';
import moxios from 'moxios';
import sinon from 'sinon';

import MachineAdmin from '../../../src/components/admin/admin_machine';
import { sites } from '../../../__test__/sample';

describe('admin_machine.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
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
      component = shallow(<MachineAdmin {...props} {...spies} />);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__machine-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('SelectField')).to.have.length(2);
      expect(component.find('MenuItem')).to.have.length(1);
      expect(component.find('h3')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('Select a Department');
      expect(component.find('Connect(ReduxForm)')).to.have.length(0);
    });

    it('3. opens a modal with the machine form on add machine click', () => {
      component.find('MenuItem').simulate('click');
      component.find('FlatButton').simulate('click');
      expect(component.find('Connect(Modal)')).to.have.length(1);
      expect(component.find('Connect(Modal)').props().title).to.equal('Create New Machine');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });

    it('4. closes modal on cancel click', () => {
      component.find('MenuItem').simulate('click');
      component.find('FlatButton').simulate('click');
      const cancel = component.find('Connect(Modal)').props().onCancel;
      cancel();
      component.setState({ showNewMachine: false });
      expect(component.find('Connect(Modal)')).to.have.length(0);
    });

    it('5. set the menu items value in the select box and populate second SelectField', () => {
      component.find('MenuItem').simulate('click');
      expect(component.find('SelectField').at(0).props().value).to.equal('Extrusion');
      expect(component.find('SelectField').at(1).children()).to.have.length(17);
      expect(component.find('FlatButton')).to.have.length(1);
      expect(component.find('FlatButton').props().label).to.equal('Add Machine');
    });

    it('6. selects the machine and shows the machine form on menuitem click', () => {
      component.find('MenuItem').simulate('click');
      component.find('SelectField').at(1).find('MenuItem').at(2)
                                                          .simulate('click');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });

    it('7. alters the state correctly on successful updateMachine call', (done) => {
      const department = Map({ name: 'test_department', machines: List([]) });
      const machine = Map({ name: 'test_machine' });
      component.setState({ machine, department, showNewMachine: true });
      component.instance().updateMachine(machine);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: machine,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Machine Successfully Updated: test_machine');
          expect(fetchHierarchy.callCount).to.equal(1);
          expect(component.state().machine).to.equal(undefined);
          expect(component.state().showNewMachine).to.equal(false);
          done();
        });
      });
    });

    it('8. calls message with an error message on createMachine fail', (done) => {
      const department = Map({ name: 'test_department', machines: List([]) });
      const machine = Map({ name: 'test_machine' });
      component.setState({ machine, department, showNewMachine: true });
      component.instance().createMachine(machine);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Error Creating Machine: test_machine');
          expect(fetchHierarchy.callCount).to.equal(0);
          expect(component.state().machine).to.equal(undefined);
          expect(component.state().showNewMachine).to.equal(false);
          done();
        });
      });
    });
    it('9. alters the state correctly on successful createMachine call', (done) => {
      const department = Map({ name: 'test_department', machines: List([]) });
      const machine = Map({ name: 'test_machine' });
      component.setState({ machine, department, showNewMachine: true });
      component.instance().createMachine(machine);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: machine,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Machine Successfully Created: test_machine');
          expect(fetchHierarchy.callCount).to.equal(1);
          expect(component.state().machine).to.equal(undefined);
          expect(component.state().showNewMachine).to.equal(false);
          done();
        });
      });
    });

    it('10. calls message with an error message on updateMachine fail', (done) => {
      const department = Map({ name: 'test_department', machines: List([]) });
      const machine = Map({ name: 'test_machine' });
      component.setState({ machine, department, showNewMachine: true });
      component.instance().updateMachine(machine);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Error Updating Machine: test_machine');
          expect(fetchHierarchy.callCount).to.equal(0);
          expect(component.state().machine).to.equal(undefined);
          expect(component.state().showNewMachine).to.equal(false);
          done();
        });
      });
    });
  });
});
