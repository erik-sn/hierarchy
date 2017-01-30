import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { is, List, Map, fromJS } from 'immutable';
import sinon from 'sinon';

import { mountWithTheme, reduxWrap } from '../../../../__test__/helper';
import ConfigurationForm, { Configuration, validate } from '../../../../src/components/admin/forms/admin_configuration';
import { sites } from '../../../../__test__/sample';

describe('admin_configuration.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  let component;
  let change;
  let handleSubmit;
  describe('Expected | >>>', () => {
    const props = {
      site: hierarchy.get(3),
    };

    beforeEach(() => {
      change = sinon.spy();
      handleSubmit = sinon.spy();
      component = shallow(
        <Configuration
          {...props}
          change={change}
          handleSubmit={handleSubmit}
        />
      );
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('Field')).to.have.length(9);
      expect(component.find('ModuleEdit')).to.have.length(1);
      expect(component.find('h3')).to.have.length(2);
      expect(component.find('h3').get(0).props.children).to.equal('General');
      expect(component.find('h3').get(1).props.children).to.equal('Location');
    });
  });

  describe('Inside Modal | >>>', () => {
    const props = {
      site: hierarchy.get(3),
      modal: true,
    };

    beforeEach(() => {
      component = shallow(
        <Configuration
          {...props}
          change={change}
          handleSubmit={handleSubmit}
        />
      );
    });

    it('1. does not have a ModuleEdit hile in a modal', () => {
      expect(component.find('ModuleEdit')).to.have.length(0);
    });
  });

  describe('Connected to redux and redux-form | >>>', () => {
    let site = hierarchy.get(3);
    const modules = List([
      Map({ name: 'module1', id: 1 }),
      Map({ name: 'module2', id: 2 }),
      Map({ name: 'module3', id: 3 }),
    ]);
    site = site.set('modules', modules);
    const props = {
      site,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      component = mountWithTheme(reduxWrap(
        <ConfigurationForm
          {...props}
          handleSubmit={handleSubmit}
          modules={modules}
        />
      ));
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });

  describe('Connected to redux and redux-form | >>>', () => {
    let site = hierarchy.get(3);
    const modules = List([
      Map({ name: 'module1', id: 1 }),
      Map({ name: 'module2', id: 2 }),
      Map({ name: 'module3', id: 3 }),
    ]);
    site = site.set('modules', modules);
    const props = {
      site,
      new: true,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      component = mountWithTheme(reduxWrap(
        <ConfigurationForm
          {...props}
          handleSubmit={handleSubmit}
        />
      ));
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });

  describe('validate | >>>', () => {

    it('1. code must be in uppercase', () => {
      const form = Map({ name: 'test', code: 'ts' });
      const errors = validate(form);
      expect(errors.code).to.equal('Must be uppercase Letters');
    });

    it('2. name is required', () => {
      const form = Map({ code: 'TS' });
      const errors = validate(form);
      expect(errors.name).to.equal('Required');
    });

    it('3. code is required', () => {
      const form = Map({ name: 'TS' });
      const errors = validate(form);
      expect(errors.code).to.equal('Required');
    });

    it('4. no errors', () => {
      const form = Map({ name: 'test', code: 'TS' });
      const errors = validate(form);
      expect(is(Map(errors), Map({}))).to.equal(true);
    });
  });
});
