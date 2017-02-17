import { expect } from 'chai';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { createMemoryHistory } from 'history';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import * as sinon from 'sinon';

import { mountWithTheme, triggerResize } from '../../../__tests__/helper';
import Navbar, { INavbarProps } from '../../../src/components/navbar/navbar';
import Nav from '../../../src/components/navbar/navbar_nav';
import Settings from '../../../src/components/navbar/navbar_settings';
import { IAppConfig, IDepartment, IHierarchyTier, IMachine,
  ISite, IUser } from '../../../src/constants/interfaces';
import { resolvePath } from '../../../src/utils/resolver';

const siteList: ISite[] = require('../../sites.json');

describe('navbar.test.tsx |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: INavbarProps = {
      user: {
        id: 1,
        admin: true,
        username: 'test_user',
        ip: '0.0.0.0',
      },
      config: {
        baseUrl: '/',
        name: 'hierarchy',
        hierarchyapi: '/api',
      },
      hierarchy: resolvePath(siteList, '/atl/extrusion/ax7'),
      path: '/atl/extrusion/ax7',
      sites: siteList,
    };

    beforeEach(() => {
      component = shallow(<Navbar {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.navbar__icon-container')).to.have.length(1);
      expect(component.find('.navbar__app-label')).to.have.length(1);
      expect(component.find('.navbar__hierarchy-container')).to.have.length(1);
      expect(component.find('.navbar__info-container')).to.have.length(1);
      expect(component.find('.navbar__username')).to.have.length(1);
      expect(component.find('.navbar__settings')).to.have.length(1);
      expect(component.find(Settings)).to.have.length(1);
    });

    it('displays the correct user', () => {
      expect(component.find('.navbar__username').text()).to.equal('test_user');
    });

    it('displays the correct application name', () => {
      expect(component.find('.navbar__app-label').text()).to.equal('hierarchy');
    });

    it('should have three hierarchy items', () => {
      expect(component.find(Nav)).to.have.length(3);
    });

    it('5. hierarchy items should have the correct values', () => {
      const items = component.find(Nav);
      expect(items.at(0).props().name).to.equal('Atlanta');
      expect(items.at(1).props().name).to.equal('Extrusion');
      expect(items.at(2).props().name).to.equal('AX7');
    });
  });

  describe('No Hierarchy | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: INavbarProps = {
      user: {
        id: 1,
        admin: true,
        username: 'test_user',
        ip: '0.0.0.0',
      },
      config: {
        baseUrl: '/',
        name: 'hierarchy',
        hierarchyapi: '/api',
      },
      hierarchy: undefined,
      path: '/atl/extrusion/ax7',
      sites: siteList,
    };

    beforeEach(() => {
      component = shallow(<Navbar {...props} />);
    });

    it('shows no hierarchy items if no hierarchy is present', () => {
      expect(component).to.exist;
      expect(component.find('.navbar__icon-container')).to.have.length(1);
    });
  });

  describe('No User | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: INavbarProps = {
      user: {
        id: 1,
        admin: true,
        username: 'test_user',
        ip: '0.0.0.0',
      },
      config: {
        baseUrl: '/',
        name: 'hierarchy',
        hierarchyapi: '/api',
      },
      hierarchy: resolvePath(siteList, '/atl/extrusion/ax7'),
      path: '/atl/extrusion/ax7',
      sites: siteList,
    };

    beforeEach(() => {
      component = shallow(<Navbar {...props} />);
    });

    it('shows no hierarchy items if no hierarchy is present', () => {
      expect(component.find('.navbar__hierarchy-item-parent')).to.have.length(0);
    });
  });

  describe('No User | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: INavbarProps = {
      user: {
        id: 1,
        admin: true,
        username: undefined,
        ip: '0.0.0.0',
      },
      config: {
        baseUrl: '/',
        name: 'hierarchy',
        hierarchyapi: '/api',
      },
      hierarchy: undefined,
      path: '/atl/extrusion/ax7',
      sites: siteList,
    };

    beforeEach(() => {
      component = shallow(<Navbar {...props} />);
    });

    it('shows no hierarchy items if no hierarchy is present', () => {
      expect(component.find('.navbar__hierarchy-item-parent')).to.have.length(0);
    });
  });

  describe('Event Listeners | >>>', () => {
    let sandbox: sinon.SinonSandbox;
    let component: ShallowWrapper<{}, {}>;
    let mountedComponent: ReactWrapper<{}, {}>;
    const props: INavbarProps = {
      user: {
        id: 1,
        admin: true,
        username: 'test_user',
        ip: '0.0.0.0',
      },
      config: {
        baseUrl: '/',
        name: 'hierarchy',
        hierarchyapi: '/api',
      },
      hierarchy: resolvePath(siteList, '/atl/extrusion/ax7'),
      path: '/atl/extrusion/ax7',
      sites: siteList,
    };

    it('hides neighbors on screen resize', () => {
      mountedComponent = mount((
        <MuiThemeProvider>
          <Navbar {...props} />
        </MuiThemeProvider>
      ), window);
      const parent = mountedComponent.find('.navbar__hierarchy-item-last');
      parent.simulate('click');

      const neighborListShow = mountedComponent.find('.navbar__neighbor-list');
      expect(neighborListShow.children()).to.have.length(10);

      triggerResize();
      const neighborListHide = mountedComponent.find('.navbar__neighbor-list');
      expect(neighborListHide.children()).to.have.length(0);
    });

    it('hides neighbors on parent click', () => {
      const history = createMemoryHistory();
      mountedComponent = mount((
        <MuiThemeProvider>
          <Navbar {...props} />
        </MuiThemeProvider>
      ), window);
      const parentInitial = mountedComponent.find('.navbar__hierarchy-item-last');
      parentInitial.simulate('click');

      const neighborListShow = mountedComponent.find('.navbar__neighbor-list');
      expect(neighborListShow.children()).to.have.length(10);

      const parentFinal = mountedComponent.find('.navbar__hierarchy-item-last');
      parentFinal.simulate('click');
      const neighborListHide = mountedComponent.find('.navbar__neighbor-list');
      expect(neighborListHide.children()).to.have.length(0);
    });

    it('calls componentWillUnmount', () => {
      component = shallow(<Navbar {...props} />);
      // test to make sure this executes correctly
      const instance: any = component.instance();
      instance.componentWillUnmount();
    });

    it('hides neighbors if they are already showing', () => {
      component = shallow(<Navbar {...props} />);
      const dropdownContainer = <div className="navbar__neighbor-container" />;
      component.setState({ dropdownContainer });
      expect(component.find('.navbar__neighbor-container')).to.have.length(1);

      component.setState({ dropdownContainer: undefined });
      expect(component.find('.navbar__neighbor-container')).to.have.length(0);
    });
  });
});
