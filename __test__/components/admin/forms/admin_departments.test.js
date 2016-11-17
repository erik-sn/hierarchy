import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import sinon from 'sinon';

import { reduxWrap } from '../../../../__test__/helper';
import DepartmentForm, { Department } from '../../../../src/components/admin/forms/admin_departments';
import { sites } from '../../../../__test__/sample';

describe('admin_departments.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  describe('Expected | >>>', () => {
    let component;
    let change;
    const props = {
      site: hierarchy.get(3),
    };

    beforeEach(() => {
      change = sinon.spy();
      component = shallow(<Department {...props} change={change} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('2. has the correct elements and prompts to select a department', () => {
      expect(component.find('form')).to.have.length(1);
      expect(component.find('SelectField')).to.have.length(1);
      expect(component.find('MenuItem')).to.have.length(1);
      expect(component.find('h3')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('Select a Department');
    });

    it('3. changes form value and prompts to select machine when department is selected', () => {
      component.find('MenuItem').simulate('click');
      expect(change.callCount).to.equal(2);
    });

    it('4. changes form value and displays machine when machine menu item is selected', () => {
      component.find('MenuItem').simulate('click');
      expect(component.find('Field')).to.have.length(2);
      expect(component.find('NewModule')).to.have.length(1);
    });
  });

  describe('Connected to redux and redux-form | >>>', () => {
    let component;
    const props = {
      site: hierarchy.get(3),
    };

    beforeEach(() => {
      component = shallow(reduxWrap(<DepartmentForm {...props} />));
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('ReduxForm')).to.have.length(1);
    });
  });
});
