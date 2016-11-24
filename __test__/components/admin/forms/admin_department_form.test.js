import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { is, List, Map, fromJS } from 'immutable';
import sinon from 'sinon';

import DepartmentConnected, { Department,
  validate } from '../../../../src/components/admin/forms/admin_department_form';
import { sites } from '../../../../__test__/sample';
import { mountWithTheme, reduxWrap } from '../../../../__test__/helper';


describe('admin_department_form.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  let component;
  let handleSubmit;
  let change;

  describe('Default | >>>', () => {
    const props = {
      department: hierarchy.get(3).get('departments').get(0),
      modules: ['module1', 'module2', 'module3'],
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      component = shallow(<Department {...props} handleSubmit={handleSubmit} change={change} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('Field')).to.have.length(2);
      expect(component.find('FlatButton')).to.have.length(2);
      expect(component.find('ModuleEdit')).to.have.length(1);
    });

    it('3. has the correct button labels', () => {
      expect(component.find('.admin__clear-button').props().label).to.equal('Clear');
      expect(component.find('.admin__submit-button').props().label).to.equal('Update');
    });

    it('4. calls change twice on clear click', () => {
      component.find('.admin__clear-button').simulate('click');
      expect(change.callCount).to.equal(2);
    });

    it('5. calls handleSubmit on form submit', () => {
      component.find('.admin__submit-button').simulate('click');
      expect(handleSubmit.callCount).to.equal(1);
    });
  });

  describe('Modal | >>>', () => {
    const props = {
      department: hierarchy.get(3).get('departments').get(0),
      modules: ['module1', 'module2', 'module3'],
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      component = shallow(<Department {...props} handleSubmit={handleSubmit} modal />);
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
      const form = Map({ code: 'test code' });
      const errors = validate(form);
      expect(errors.name).to.equal('Required');
    });

    it('2. name can only contain letters', () => {
      const form = Map({ name: 'test name12' });
      const errors = validate(form);
      expect(errors.name).to.equal('Name can only contain letters');
    });

    it('3. no errors', () => {
      const form = Map({ name: 'test' });
      const errors = validate(form);
      expect(is(Map(errors), Map({}))).to.equal(true);
    });
  });

  describe('Connected to redux and redux-form | >>>', () => {
    const props = {
      modules: ['module1', 'module2', 'module3'],
    };

    let department = hierarchy.get(3).get('departments').get(0);
    const modules = List([
      Map({ name: 'module1', id: 1 }),
      Map({ name: 'module2', id: 2 }),
      Map({ name: 'module3', id: 3 }),
    ]);
    department = department.set('modules', modules);
    beforeEach(() => {
      handleSubmit = sinon.spy();
      component = mountWithTheme(reduxWrap(
        <DepartmentConnected
          {...props}
          department={department}
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

    let department = hierarchy.get(3).get('departments').get(0);
    const modules = List([
      Map({ name: 'module1', id: 1 }),
      Map({ name: 'module2', id: 2 }),
      Map({ name: 'module3', id: 3 }),
    ]);
    department = department.set('modules', modules);
    beforeEach(() => {
      handleSubmit = sinon.spy();
      component = mountWithTheme(reduxWrap(
        <DepartmentConnected
          {...props}
          department={department}
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
