import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { is, List, Map, fromJS } from 'immutable';
import sinon from 'sinon';

import MachineConnected, { Machine,
  validate } from '../../../../src/components/admin/forms/admin_machine_form';
import { sites } from '../../../../__test__/sample';
import { mountWithTheme, reduxWrap } from '../../../../__test__/helper';


describe('admin_machine_form.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  let component;
  let handleSubmit;
  let change;

  describe('Default | >>>', () => {
    const props = {
      machine: hierarchy.get(3).get('departments').get(0).get('machines')
                                                         .get(0),
      modules: ['module1', 'module2', 'module3'],
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      component = shallow(<Machine {...props} handleSubmit={handleSubmit} change={change} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('Field')).to.have.length(3);
      expect(component.find('FlatButton')).to.have.length(2);
      expect(component.find('ModuleEdit')).to.have.length(1);
    });

    it('3. has the correct button labels', () => {
      expect(component.find('.admin__clear-button').props().label).to.equal('Clear');
      expect(component.find('.admin__submit-button').props().label).to.equal('Update');
    });

    it('4. calls change twice on clear click', () => {
      component.find('.admin__clear-button').simulate('click');
      expect(change.callCount).to.equal(3);
    });

    it('5. calls handleSubmit on form submit', () => {
      component.find('.admin__submit-button').simulate('click');
      expect(handleSubmit.callCount).to.equal(1);
    });
  });

  describe('Modal | >>>', () => {
    const props = {
      machine: hierarchy.get(3).get('departments').get(0).get('machines')
                                                         .get(0),
      modules: ['module1', 'module2', 'module3'],
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      component = shallow(<Machine {...props} handleSubmit={handleSubmit} modal />);
    });

    it('1. submit button has the label Create when in a modal', () => {
      expect(component.find('.admin__submit-button').props().label).to.equal('Create');
    });

    it('2. has no ModuleEdit in modal mode', () => {
      expect(component.find('ModuleEdit')).to.have.length(0);
    });
  });

  describe('validate | >>>', () => {
    it('1. name is required', () => {
      const form = Map({ type: 'test type' });
      const errors = validate(form);
      expect(errors.name).to.equal('Required');
    });

    it('2. name can only container letters/numbers', () => {
      const form = Map({ name: 'test1 name$', type: 'test type' });
      const errors = validate(form);
      expect(errors.name).to.equal('Name can only contain letters and numbers');
    });

    it('3. type is required', () => {
      const form = Map({ name: 'test name' });
      const errors = validate(form);
      expect(errors.type).to.equal('Required');
    });

    it('4. type can only container letters/numbers', () => {
      const form = Map({ type: 'test1 type$', name: 'test name' });
      const errors = validate(form);
      expect(errors.type).to.equal('Type can only contain letters and numbers');
    });

    it('5. no errors', () => {
      const form = Map({ type: 'test type', name: 'test name' });
      const errors = validate(form);
      console.log('Error: ', errors);
      expect(is(Map(errors), Map({}))).to.equal(true);
    });
  });

  describe('Connects to redux | >>>', () => {
    const props = {
      modules: ['module1', 'module2', 'module3'],
    };

    const modules = List([
      Map({ name: 'module1', id: 1 }),
      Map({ name: 'module2', id: 2 }),
      Map({ name: 'module3', id: 3 }),
    ]);
    let machine = hierarchy.get(3).get('departments').get(0).get('machines').get(0);
    machine = machine.set('modules', modules);
    beforeEach(() => {
      handleSubmit = sinon.spy();
      component = mountWithTheme(reduxWrap(
        <MachineConnected
          {...props}
          machine={machine}
          handleSubmit={handleSubmit}
          change={change}
          modules={modules}
        />
      ));
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });

  describe('Connects to redux in a modal | >>>', () => {
    const props = {
      modules: ['module1', 'module2', 'module3'],
    };

    const modules = List([
      Map({ name: 'module1', id: 1 }),
      Map({ name: 'module2', id: 2 }),
      Map({ name: 'module3', id: 3 }),
    ]);
    let machine = hierarchy.get(3).get('departments').get(0).get('machines').get(0);
    machine = machine.set('modules', modules);
    beforeEach(() => {
      handleSubmit = sinon.spy();
      component = mountWithTheme(reduxWrap(
        <MachineConnected
          {...props}
          machine={machine}
          handleSubmit={handleSubmit}
          change={change}
          modules={modules}
          new
        />
      ));
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });
});
