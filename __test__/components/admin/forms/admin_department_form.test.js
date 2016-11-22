import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import sinon from 'sinon';

import { Department } from '../../../../src/components/admin/forms/admin_department_form';
import { sites } from '../../../../__test__/sample';


describe('admin_departments.test.js |', () => {
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
});
