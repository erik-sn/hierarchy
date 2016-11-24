import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { is, List, Map, fromJS } from 'immutable';
import sinon from 'sinon';

import ModuleConnected, { Module,
  validate, validateOnSubmit } from '../../../../src/components/admin/forms/admin_module_form';
import { sites } from '../../../../__test__/sample';
import { mountWithTheme, reduxWrap } from '../../../../__test__/helper';


describe('admin_module_form.test.js |', () => {
  let component;
  let handleSubmit;
  let change;
  let reset;
  let update;
  let remove;
  let clear;

  describe('Default | >>>', () => {
    const props = {
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      reset = sinon.spy();
      update = sinon.spy();
      remove = sinon.spy();
      clear = sinon.spy();
      const spies = { handleSubmit, change, reset, update, remove, clear };
      component = shallow(
        <Module
          {...props}
          {...spies}
          module={Map({ name: 'current_module' })}
        />
      );
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(2);
    });

    it('2. renders correct elements', () => {
      expect(component.find('Field')).to.have.length(3);
      expect(component.find('FlatButton')).to.have.length(3);
    });

    it('3. calls update and reset on update button click', () => {
      component.find('FlatButton').at(0).simulate('click');
      expect(update.callCount).to.equal(1);
      expect(reset.callCount).to.equal(2);
    });

    it('4. calls remove and reset on update button click', () => {
      component.find('FlatButton').at(1).simulate('click');
      expect(remove.callCount).to.equal(1);
      expect(reset.callCount).to.equal(2);
    });

    it('5. calls remove and reset on clear button click', () => {
      component.find('FlatButton').at(2).simulate('click');
      expect(clear.callCount).to.equal(1);
      expect(reset.callCount).to.equal(2);
    });

    it('6. componentWillMount without props doesnt reset', () => {
      component.instance().componentWillReceiveProps({});
      expect(change.callCount).to.equal(0);
    });

    it('7. componentWillMount calls change on all fields', () => {
      component.instance().componentWillReceiveProps({
        module: Map({ name: 'test_name' }),
        change,
      });
      expect(change.callCount).to.equal(4);
    });

    it('8. componentWillMount does not call change if same module', () => {
      component.instance().componentWillReceiveProps({
        module: Map({ name: 'current_module' }),
        change,
      });
      expect(change.callCount).to.equal(0);
    });
  });

  describe('Clean form | >>>', () => {
    const props = {
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      reset = sinon.spy();
      const spies = { handleSubmit, change, reset };
      component = shallow(
        <Module
          {...props}
          {...spies}
          clean
        />
      );
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(2);
    });

    it('2. renders correct elements', () => {
      expect(component.find('Field')).to.have.length(3);
      expect(component.find('FlatButton')).to.have.length(2);
    });
  });

  describe('Submit Failed | >>>', () => {
    const props = {
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      reset = sinon.spy();
      const spies = { handleSubmit, change, reset };
      component = shallow(
        <Module
          {...props}
          {...spies}
          submitFailed
        />
      );
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('.admin__error-field').text()).to.equal('Error Submitting Form');
    });
  });

  describe('validate | >>>', () => {
    it('1. name is required', () => {
      const form = Map({ description: 'test description' });
      const errors = validate(form);
      expect(errors.name).to.equal('Required');
    });

    it('2. type is required', () => {
      const form = Map({ name: 'test name' });
      const errors = validate(form);
      expect(errors.description).to.equal('Required');
    });

    it('3. no errors', () => {
      const form = Map({ description: 'test description', name: 'test name' });
      const errors = validate(form);
      expect(is(Map(errors), Map({}))).to.equal(true);
    });
  });

  describe('validateOnSubmit | >>>', () => {
    it('1. name is required', () => {
      const form = Map({ description: 'test description' });
      expect(() => validateOnSubmit(form)).to.throw('SubmissionError: Submit Validation Failed');
    });

    it('2. type is required', () => {
      const form = Map({ name: 'test name' });
      expect(() => validateOnSubmit(form)).to.throw('SubmissionError: Submit Validation Failed');
    });

    it('3. no errors', () => {
      const form = Map({ description: 'test description', name: 'test name' });
      const errors = validateOnSubmit(form);
      expect(is(Map(errors), Map({}))).to.equal(true);
    });
  });

  describe('Connects to redux | >>>', () => {
    const props = {
    };
    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      reset = sinon.spy();
      const spies = { handleSubmit, change, reset };
      component = mountWithTheme(reduxWrap(
        <ModuleConnected
          {...props}
          {...spies}
        />
      ));
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });

  describe('Connects to redux with clean | >>>', () => {
    const props = {
    };
    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      reset = sinon.spy();
      const spies = { handleSubmit, change, reset };
      component = mountWithTheme(reduxWrap(
        <ModuleConnected
          {...props}
          {...spies}
          clean
        />
      ));
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });
});
