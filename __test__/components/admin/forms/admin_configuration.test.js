import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import sinon from 'sinon';

import { reduxWrap } from '../../../../__test__/helper';
import ConfigurationForm, { Configuration } from '../../../../src/components/admin/forms/admin_configuration';
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
      component = shallow(<Configuration {...props} change={change} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('Field')).to.have.length(8);
      expect(component.find('h3')).to.have.length(2);
      expect(component.find('h3').get(0).props.children).to.equal('General');
      expect(component.find('h3').get(1).props.children).to.equal('Location');
    });
  });

  describe('Connected to redux and redux-form | >>>', () => {
    let component;
    const props = {
      site: hierarchy.get(3),
    };

    beforeEach(() => {
      component = shallow(reduxWrap(<ConfigurationForm {...props} />));
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });
});
