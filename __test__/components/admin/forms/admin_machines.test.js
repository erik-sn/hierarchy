import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import sinon from 'sinon';

import { reduxWrap } from '../../../../__test__/helper';
import MachineForm, { Machine } from '../../../../src/components/admin/forms/admin_machines';
import { sites } from '../../../../__test__/sample';

describe('admin_machines.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  describe('Default | >>>', () => {
    let component;
    let change;
    const props = {
      site: hierarchy.get(3),
    };

    beforeEach(() => {
      change = sinon.spy();
      component = shallow(<Machine {...props} change={change} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('2. has the correct elements and prompts to select a department', () => {
      expect(component.find('form')).to.have.length(1);
      expect(component.find('SelectField')).to.have.length(2);
      expect(component.find('MenuItem')).to.have.length(1);
      expect(component.find('List')).to.have.length(1);
      expect(component.find('h3')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('Select a Department');
    });

    it('3. changes form value and prompts to select machine when department is selected', () => {
      component.find('MenuItem').simulate('click');
      expect(component.find('MenuItem')).to.have.length(18);
      expect(component.find('h3')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('Select a Machine');
      expect(change.callCount).to.equal(1);
    });

    it('4. changes form value and displays machine when machine menu item is selected', () => {
      component.find('MenuItem').simulate('click');
      component.find('.admin__machine_select').find('MenuItem').first().simulate('click');
      expect(component.find('Field')).to.have.length(3);
      expect(component.find('NewModule')).to.have.length(1);
      expect(change.callCount).to.equal(5); // 1 from department, 4 fields in the machine form
    });
  });

  describe('Connects with Redux Form | >>>', () => {
    let component;
    const props = {
      site: hierarchy.get(3),
    };

    beforeEach(() => {
      component = shallow(reduxWrap(<MachineForm {...props} />));
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('ReduxForm')).to.have.length(1);
    });
  });
});
