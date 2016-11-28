import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { List, Map } from 'immutable';
import sinon from 'sinon';

import { mountWithTheme } from '../../../../__test__/helper';
import ModuleEdit from '../../../../src/components/admin/forms/admin_module_edit';

describe('admin_module_edit.test.js |', () => {
  let handleDeleteModule;
  let handleAddModule;
  let component;
  let change;

  describe('Default | >>>', () => {
    const item = Map({ modules: List([Map({ name: 'module9', id: 9 }), Map({ name: 'module10', id: 10 })]) });
    const props = {
      item,
      modules: List([
        Map({ name: 'module1', id: 1 }),
        Map({ name: 'module2', id: 2 }),
        Map({ name: 'module3', id: 3 }),
      ]),
    };

    beforeEach(() => {
      handleDeleteModule = sinon.spy();
      handleAddModule = sinon.spy();
      change = sinon.spy();
      component = shallow(
        <ModuleEdit
          {...props}
          change={change}
          handleAddModule={handleAddModule}
          handleDeleteModule={handleDeleteModule}
        />
      );
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__module-edit')).to.have.length(1);
      expect(change.callCount).to.equal(1); // this is used once in constructor
    });

    it('2. has the correct elements', () => {
      expect(component.find('h3')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('Modules');
      expect(component.find('List').children()).to.have.length(2);
      expect(component.find('SelectField').children()).to.have.length(3);
    });

    it('3. calls delete module when a list item is close icon is clicked', () => {
      component = mountWithTheme(
        <ModuleEdit
          {...props}
          change={change}
          handleAddModule={handleAddModule}
          handleDeleteModule={handleDeleteModule}
        />
      );
      expect(component.find('List').find('MenuItem')).to.have.length(2);
      component.find('List').find('MenuItem').at(0).find('SvgIcon').simulate('click');
      expect(component.find('List').find('MenuItem')).to.have.length(1);
    });

    it('4. calls add module when a select field menu item is clicked', () => {
      expect(component.find('List').find('MenuItem')).to.have.length(2);
      component.find('SelectField').find('MenuItem').at(0).simulate('click');
      expect(component.find('List').find('MenuItem')).to.have.length(3);
    });

    it('5. returns undefined for module functions if module is undefined', () => {
      expect(component.instance().handleAddModule(undefined)).to.equal(undefined);
      expect(component.instance().handleDeleteModule(undefined)).to.equal(undefined);
    });
  });

  describe('No modules present | >>>', () => {
    const item = Map({ modules: List([]) });
    const props = {
      item,
      modules: List([
        Map({ name: 'module1', id: 1 }),
        Map({ name: 'module2', id: 2 }),
        Map({ name: 'module3', id: 3 }),
      ]),
    };

    beforeEach(() => {
      handleDeleteModule = sinon.spy();
      handleAddModule = sinon.spy();
      change = sinon.spy();
      component = shallow(
        <ModuleEdit
          {...props}
          change={change}
          handleAddModule={handleAddModule}
          handleDeleteModule={handleDeleteModule}
        />
      );
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('.admin__message')).to.have.length(1);
      expect(component.find('.admin__message').text()).to.equal('No Modules');
    });
  });
});
