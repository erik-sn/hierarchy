import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { List, Map } from 'immutable';

import { mountWithTheme, reduxWrap } from '../../../../__test__/helper';
import NewModule from '../../../../src/components/admin/forms/admin_module';

describe('admin_module.test.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      target: Map({
        modules: List([
          Map({ name: 'test1' }),
          Map({ name: 'test2' }),
          Map({ name: 'test3' }),
        ]),
      }),
    };
    const modules = props.target.get('modules');

    beforeEach(() => {
      component = shallow(<NewModule {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__new-module-container')).to.have.length(1);
    });

    it('2. has a select field with the expected options', () => {
      const select = component.find('SelectField');
      expect(select).to.have.length(1);
      expect(select.hasClass('admin__form-field')).to.equal(true);
      expect(select.children()).to.have.length(modules.size);
      expect(select.children().get(1).props.value).to.equal(modules.get(1).get('name'));
    });

    it('3. select field has the correct value on state change', () => {
      expect(component.find('SelectField').props().value).to.equal('');
      component.setState({ module: modules.get(1) });
      expect(component.find('SelectField').props().value).to.equal(modules.get(1).get('name'));
    });

    it('4. add module button shows regardless of value', () => {
      expect(component.find('FlatButton')).to.have.length(1);
      expect(component.find('FlatButton').props().label).to.equal('Add Module');
      component.setState({ module: modules.get(1) });
      expect(component.find('FlatButton').get(0).props.label).to.equal('Add Module');
    });

    it('5. update and delete buttons only show if a module is selected', () => {
      expect(component.find('FlatButton')).to.have.length(1);
      component.setState({ module: modules.get(1) });
      expect(component.find('FlatButton')).to.have.length(3);
      expect(component.find('FlatButton').get(1).props.label).to.equal('Edit Module');
      expect(component.find('FlatButton').get(2).props.label).to.equal('Delete Module');
    });

    it('6. buttons change state when clicked', () => {
      // menu item must be selected for buttons to show
      component.find('MenuItem').first().simulate('click');
      expect(component.state().module).to.equal(modules.get(0));
      expect(component.state().showEditModule).to.equal(false);
      expect(component.state().showDeleteModule).to.equal(false);

      component.find('.admin__edit-module-button').simulate('click');
      expect(component.state().showEditModule).to.equal(true);
      component.find('.admin__delete-module-button').simulate('click');
      expect(component.state().showDeleteModule).to.equal(true);
    });

    it('7. shows the new module modal when add is clicked', () => {
      expect(component.find('Connect(Modal)')).to.have.length(0);
      component.find('FlatButton').simulate('click');
      expect(component.find('Connect(Modal)')).to.have.length(1);
    });

    it('8. New module modal has the correct title and message', () => {
      component.find('FlatButton').simulate('click');
      expect(component.find('Connect(Modal)').props().title).to.equal('Add a Module');
      expect(component.find('Connect(Modal)').props().message).to.equal('Enter the name of the new module');
    });

    it('9. New module modal has a text field, changes update state', () => {
      component.find('FlatButton').simulate('click');
      expect(component.find('Connect(Modal)').find('TextField')).to.have.length(1);
      component.find('Connect(Modal)').find('TextField').simulate('change', { target: { value: 'new value' } });
      expect(component.find('Connect(Modal)').find('TextField').props().value).to.equal('new value');
    });

    it('10. resets state when hideNewModule is called', () => {
      component.setState({ showNewModule: true, newModuleText: 'test' });
      component.instance().hideNewModule();
      expect(component.state().showNewModule).to.equal(false);
      expect(component.state().newModuleText).to.equal('');
    });

    it('11. updates the state when updateModuleField is called', () => {
      component.setState({ newModuleText: 'test' });
      component.instance().updateModuleField({ target: { value: 'new test' } });
      expect(component.state().newModuleText).to.equal('new test');
    });

    it('12. addNewModule resets the field', () => {
      component.setState({ showNewModule: true, newModuleText: 'test' });
      component.instance().addNewModule();
      expect(component.state().showNewModule).to.equal(false);
      expect(component.state().newModuleText).to.equal('');
    });
  });

  describe('No Target | >>>', () => {
    it('1. renders but has no menu items if target is undefined', () => {
      const props = {
        target: undefined,
      };
      const component = shallow(<NewModule {...props} />);
      expect(component).to.have.length(1);
      expect(component.find('MenuItem')).to.have.length(0);
    });

    it('2. renders but has no menu items if target has no modules', () => {
      const props = {
        target: Map({}),
      };
      const component = shallow(<NewModule {...props} />);
      expect(component).to.have.length(1);
      expect(component.find('MenuItem')).to.have.length(0);
    });
  });
});
