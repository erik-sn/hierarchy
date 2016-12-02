import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import { AdminHierarchy } from '../../../src/components/admin/admin_hierarchy';
import { sites } from '../../../__test__/sample';

describe('admin_hierarchy.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  describe('Default | >>>', () => {
    let component;
    const props = {
      sites: hierarchy,
    };

    beforeEach(() => {
      component = shallow(<AdminHierarchy {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__hierarchy-container')).to.have.length(1);
    });

    it('2. Has a AdminSiteList component', () => {
      expect(component.find('AdminSiteList')).to.have.length(1);
    });
  });

  describe('With Code | >>>', () => {
    let component;
    const props = {
      fetchHierarchy: () => undefined,
      sites: hierarchy,
      splat: '/ox',
    };

    beforeEach(() => {
      component = shallow(<AdminHierarchy {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__hierarchy-container')).to.have.length(1);
    });

    it('2. Has an AdminSite component', () => {
      expect(component.find('AdminSite')).to.have.length(1);
    });
  });
});
