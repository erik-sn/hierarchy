import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import Department from '../../../src/components/admin/admin_department';
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
      component = shallow(<Department {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__department-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('SelectField')).to.have.length(1);
      expect(component.find('MenuItem')).to.have.length(1);
      expect(component.find('FlatButton')).to.have.length(1);
    });

    it('3. opens a modal with the department form on add department click', () => {
      component.find('FlatButton').simulate('click');
      expect(component.find('Connect(Modal)')).to.have.length(1);
      expect(component.find('Connect(Modal)').props().title).to.equal('Create New Department');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });

    it('4. closes modal on cancel click', () => {
      component.find('FlatButton').simulate('click');
      const cancel = component.find('Connect(Modal)').props().onCancel;
      cancel();
      component.setState({ showNewDepartment: false });
      expect(component.find('Connect(Modal)')).to.have.length(0);
    });

    it('5. set the menu items value in the select box and show the department form', () => {
      component.find('MenuItem').simulate('click');
      expect(component.find('SelectField').props().value).to.equal('Extrusion');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
      expect(component.find('FlatButton')).to.have.length(0);
    });
  });
});
