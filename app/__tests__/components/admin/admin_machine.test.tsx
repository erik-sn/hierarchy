import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as moxios from 'moxios';
import * as React from 'react';
import * as sinon from 'sinon';

import MachineAdmin, { IMachineAdminProps, IMachineAdminState } from '../../../src/components/admin/admin_machine';
import { IDepartment, ISite } from '../../../src/constants/interfaces';

const siteList: ISite[] = require('../../sites.json');

describe('admin_machine.test.js |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let message: sinon.SinonSpy;
    let fetchHierarchy: sinon.SinonSpy;
    const props: IMachineAdminProps = {
      site: siteList[0],
      modules: siteList[0].departments[0].machines[0].modules,
      message: undefined,
      fetchHierarchy: undefined,
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

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__machine-container')).to.have.length(1);
    });

    it('has the correct elements', () => {
      expect(component.find('SelectField')).to.have.length(2);
      expect(component.find('MenuItem')).to.have.length(2);
      expect(component.find('h3')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('Select a Department');
      expect(component.find('Connect(ReduxForm)')).to.have.length(0);
    });

    it('opens a modal with the machine form on add machine click', () => {
      component.find('MenuItem').first().simulate('click');
      component.find('FlatButton').simulate('click');
      expect(component.find('Connect(Component)')).to.have.length(1);
      expect(component.find('Connect(Component)').props().title).to.equal('Create New Machine');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });

    it('closes modal on cancel click', () => {
      component.find('MenuItem').first().simulate('click');
      component.find('FlatButton').simulate('click');
      const componentProps: any = component.find('Connect(Component)').props();
      componentProps.onCancel();
      component.setState({ showNewMachine: false });
      expect(component.find('Connect(Modal)')).to.have.length(0);
    });

    it('sets the menu items value in the select box and populate second SelectField', () => {
      component.find('MenuItem').first().simulate('click');
      expect(component.find('SelectField').at(0).props().value).to.equal('Extrusion');
      expect(component.find('SelectField').at(1).children()).to.have.length(10);
      expect(component.find('FlatButton')).to.have.length(1);
      expect(component.find('FlatButton').props().label).to.equal('Add Machine');
    });

    it('selects the machine and shows the machine form on menuitem click', () => {
      component.find('MenuItem').first().simulate('click');
      component.find('SelectField').at(1).find('MenuItem').at(2)
                                                          .simulate('click');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });

    it('componentWillMount updates the state', () => {
      const nextProps: IMachineAdminProps = {
        site: siteList[1],
        modules: siteList[0].departments[0].machines[0].modules,
        message: undefined,
        fetchHierarchy: undefined,
      };
      component.setState({
        department: siteList[1].departments[0],
        refreshDepartment: true,
      });
      component.setProps(nextProps);
      const state: any = component.state();
      expect(state.refreshDepartment).to.be.false;
      expect(state.department).to.deep.equal(siteList[1].departments[0]);
    });

    it('alters the state correctly on successful updateMachine call', (done) => {
      const department: any = { name: 'test_department', machines: [] };
      const machine: any = { name: 'test_machine' };
      component.setState({ machine, department, showNewForm: true });
      const instance: any = component.instance();
      instance.updateMachine(machine);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: machine,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Machine Successfully Updated: test_machine');
          expect(fetchHierarchy.callCount).to.equal(1);
          const state: any = component.state();
          expect(state.machine).to.equal(undefined);
          expect(state.showNewForm).to.equal(false);
          done();
        });
      });
    });

    it('calls message with an error message on createMachine fail', (done) => {
      const department: any = { name: 'test_department', machines: [] };
      const machine: any = { name: 'test_machine' };
      component.setState({ machine, department, showNewForm: true });
      const instance: any = component.instance();
      instance.createMachine(machine);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Error Creating Machine: test_machine');
          expect(fetchHierarchy.callCount).to.equal(0);
          const state: any = component.state();
          expect(state.machine).to.equal(undefined);
          expect(state.showNewForm).to.equal(false);
          done();
        });
      });
    });

    it('alters the state correctly on successful createMachine call', (done) => {
      const department: any = { name: 'test_department', machines: [] };
      const machine: any = { name: 'test_machine' };
      component.setState({ machine, department, showNewForm: true });
      const instance: any = component.instance();
      instance.createMachine(machine);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: machine,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Machine Successfully Created: test_machine');
          expect(fetchHierarchy.callCount).to.equal(1);
          const state: any = component.state();
          expect(state.machine).to.equal(undefined);
          expect(state.showNewForm).to.equal(false);
          done();
        });
      });
    });

    it('calls message with an error message on updateMachine fail', (done) => {
      const department: any = { name: 'test_department', machines: [] };
      const machine: any = { name: 'test_machine' };
      component.setState({ machine, department, showNewMachine: true });
      const instance: any = component.instance();
      instance.updateMachine(machine);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          expect(message.callCount).to.equal(1);
          expect(message.args[0][0]).to.equal('Error Updating Machine: test_machine');
          expect(fetchHierarchy.callCount).to.equal(0);
          const state: any = component.state();
          expect(state.machine).to.equal(undefined);
          expect(state.showNewForm).to.equal(false);
          done();
        });
      });
    });
  });
});
