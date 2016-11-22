import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import MachineAdmin from '../../../src/components/admin/admin_machine';
import { sites } from '../../../__test__/sample';

describe('admin_departments.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  describe('Expected | >>>', () => {
    let component;
    const props = {
      site: hierarchy.get(3),
      modules: ['module1', 'module2', 'module3'],
    };

    beforeEach(() => {
      component = shallow(<MachineAdmin {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__machine-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('SelectField')).to.have.length(2);
      expect(component.find('MenuItem')).to.have.length(1);
      expect(component.find('h3')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('Select a Department');
      expect(component.find('Connect(ReduxForm)')).to.have.length(0);
    });

    it('3. opens a modal with the machine form on add machine click', () => {
      component.find('MenuItem').simulate('click');
      component.find('FlatButton').simulate('click');
      expect(component.find('Connect(Modal)')).to.have.length(1);
      expect(component.find('Connect(Modal)').props().title).to.equal('Create New Machine');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });

    it('4. closes modal on cancel click', () => {
      component.find('MenuItem').simulate('click');
      component.find('FlatButton').simulate('click');
      const cancel = component.find('Connect(Modal)').props().onCancel;
      cancel();
      component.setState({ showNewMachine: false });
      expect(component.find('Connect(Modal)')).to.have.length(0);
    });

    it('5. set the menu items value in the select box and populate second SelectField', () => {
      component.find('MenuItem').simulate('click');
      expect(component.find('SelectField').at(0).props().value).to.equal('Extrusion');
      expect(component.find('SelectField').at(1).children()).to.have.length(17);
      expect(component.find('FlatButton')).to.have.length(1);
      expect(component.find('FlatButton').props().label).to.equal('Add Machine');
    });

    it('6. selects the machine and shows the machine form on menuitem click', () => {
      component.find('MenuItem').simulate('click');
      component.find('SelectField').at(1).find('MenuItem').at(2)
                                                          .simulate('click');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });
});
