import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import sinon from 'sinon';

import AdminSiteList from '../../../src/components/admin/admin_site_list';
import { sites } from '../../../__test__/sample';

describe('admin_site_list.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  describe('Expected | >>>', () => {
    let component;
    let navigate;
    const props = {
      sites: hierarchy,
    };

    beforeEach(() => {
      navigate = sinon.spy();
      component = shallow(<AdminSiteList {...props} navigate={navigate} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__site-list-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('List')).to.have.length(1);
      expect(component.find('ListItem')).to.have.length(6);
      expect(component.find('FlatButton')).to.have.length(1);
    });

    it('3. calls navigate on click', () => {
      component.find('ListItem').first().simulate('click');
      expect(navigate.callCount).to.equal(1);
    });
  });
});
