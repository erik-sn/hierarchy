
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import AdminHierarchy, { IAdminHierarchyProps } from '../../../src/components/admin/admin_hierarchy';
import { IDepartment, ISite } from '../../../src/constants/interfaces';

const siteList: ISite[] = require('../../sites.json');

describe('admin_hierarchy.test.tsx |', () => {
  describe('Default | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IAdminHierarchyProps = {
      sites: siteList,
      splat: '/',
      fetchHierarchy: (params: string) => undefined,
    };

    beforeEach(() => {
      component = shallow(<AdminHierarchy {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__hierarchy-container')).to.have.length(1);
    });

    it('Has a AdminSiteList component', () => {
      expect(component.find('AdminSiteList')).to.have.length(1);
    });
  });

  describe('With Code | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IAdminHierarchyProps = {
      fetchHierarchy: (params: string) => undefined,
      sites: siteList,
      splat: '/atl',
    };

    beforeEach(() => {
      component = shallow(<AdminHierarchy {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__hierarchy-container')).to.have.length(1);
    });

    it('Has an AdminSite component', () => {
      expect(component.find('AdminSite')).to.have.length(1);
    });
  });
});
