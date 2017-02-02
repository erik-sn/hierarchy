import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import { mountWithTheme, reduxWrap } from '../../../__tests__/helper';
import AdminConnected, { Admin, IAdminProps } from '../../../src/components/admin/admin';
import AdminHierarchy from '../../../src/components/admin/admin_hierarchy';
import AdminTabs from '../../../src/components/admin/admin_tabs';
import { ISite } from '../../../src/constants/interfaces';

const siteList: ISite[] = require('../../sites.json');

describe('admin.test.tsx |', () => {
  describe('Default | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let fetchHierarchy: sinon.SinonSpy;
    const props: IAdminProps = {
      fetchHierarchy: undefined,
      sites: siteList,
      params: {
        menu: 'hierarchy',
        splat: undefined,
      },
      user: { id: 1, username: 'test name', admin: true, ip: '127.0.0.1' },
    };

    beforeEach(() => {
      fetchHierarchy = sinon.spy();
      component = shallow(<Admin {...props} fetchHierarchy={fetchHierarchy} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.admin__container')).to.have.length(1);
    });

    it('has the correct elements', () => {
      expect(component.find('Card')).to.have.length(1);
      expect(component.find('CardHeader')).to.have.length(1);
      expect(component.find(AdminTabs)).to.have.length(1);
      expect(component.find(AdminHierarchy)).to.have.length(1);
    });

    it('shows the specification config if specifications are selected', () => {
      const newProps: IAdminProps = {
        fetchHierarchy: undefined,
        sites: siteList,
        params: {
          menu: 'specifications',
          splat: undefined,
        },
        user: { id: 1, username: 'test name', admin: true, ip: '127.0.0.1' },
      };
      component = shallow(<Admin {...newProps} />);
      expect(component.find('.admin__specifications')).to.have.length(1);
    });


    it('shows the modules config if modules are selected', () => {
      const newProps: IAdminProps = {
        fetchHierarchy: undefined,
        sites: siteList,
        params: {
          menu: 'modules',
          splat: undefined,
        },
        user: { id: 1, username: 'test name', admin: true, ip: '127.0.0.1' },
      };
      component = shallow(<Admin {...newProps} />);
      expect(component.find('Connect(ModuleAdmin)')).to.have.length(1);
    });

    it('renders hierarchy if no menu in props', () => {
      const newProps: IAdminProps = {
        fetchHierarchy: undefined,
        sites: siteList,
        params: {
          menu: '',
          splat: undefined,
        },
        user: { id: 1, username: 'test name', admin: true, ip: '127.0.0.1' },
      };
      component = shallow(<Admin {...newProps} />);
      expect(component.find(AdminHierarchy)).to.have.length(1);
    });

    it('calls the fetchHierarchy function in CDM', () => {
      const instance: any = component.instance();
      instance.componentDidMount();
      expect(fetchHierarchy.callCount).to.equal(1);
    });
  });

  describe('Not Authorized | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IAdminProps = {
      fetchHierarchy: undefined,
      sites: siteList,
      params: {
        menu: 'modules',
        splat: undefined,
      },
      user: { id: 1, username: 'test name', admin: false, ip: '127.0.0.1' },
    };

    beforeEach(() => {
      component = shallow(<Admin {...props} />);
    });

    it('renders unauthorized containers', () => {
      expect(component).to.exist;
      expect(component.find('.admin__message')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('You are not authorized to view this section');
    });
  });

  describe('Connects to Redux | >>>', () => {
    let component: any;
    let fetchHierarchy: sinon.SinonSpy;
    const props: IAdminProps = {
      fetchHierarchy: undefined,
      sites: siteList,
      params: {
        menu: 'modules',
        splat: undefined,
      },
      user: { id: 1, username: 'test name', admin: true, ip: '127.0.0.1' },
    };

    beforeEach(() => {
      fetchHierarchy = sinon.spy();
      component = mountWithTheme(reduxWrap(<AdminConnected {...props} fetchHierarchy={fetchHierarchy} />), props);
      component.setProps(props);
    });

    it('renders containers', () => {
      expect(component).to.exist;
    });
  });
});
