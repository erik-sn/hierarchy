import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as moxios from 'moxios';
import * as React from 'react';
import * as sinon from 'sinon';

import ApplicationContainer, { Application,
  IApplicationProps } from '../../src/components/application';
import Modal from '../../src/components/modal';
import { IAppConfig, IDepartment, IHierarchyTier, IMachine, IModal,
  ISite } from '../../src/constants/interfaces';
import { mountWithTheme, reduxWrap } from '../helper';

const siteList: ISite[] = require('../sites.json');

describe('application.test.tsx |', () => {
  let component: ShallowWrapper<{}, {}>;
  let fetchAuth: sinon.SinonSpy;
  let fetchHierarchy: sinon.SinonSpy;
  const defaultProps: IApplicationProps = {
    user: {
      username: 'test_user',
      ip: '0.0.0.0',
      admin: false,
      id: 1,
    },
    userError: false,
    sites: siteList,
    siteError: false,
    location: { pathname: '/' },
    modal: {
      showModal: false,
      component: undefined
    },
    config: {
      name: 'hierarchy',
      baseUrl: '',
      hierarchyapi: '/api',
    },
    fetchHierarchy: undefined,
    fetchAuth: undefined,
    children: undefined,
  };

  describe('Expected | >>>', () => {
    beforeEach(() => {
      component = shallow(
        <Application {...defaultProps} >
          <h3>Child</h3>
        </Application>,
      );
    });

    it('renders something & has correct containers', () => {
      expect(component.find('Navbar')).to.exist;
      expect(component.find('.application__content-container')).to.have.length(1);
    });

    it('renders child components', () => {
      expect(component.find('h3').text()).to.equal('Child');
    });
  });

  describe('No Site Data | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    beforeEach(() => {
      fetchAuth = sinon.spy();
      fetchHierarchy = sinon.spy();
      mountedComponent = mountWithTheme(
        <Application
          {...defaultProps}
          sites={undefined}
          fetchAuth={fetchAuth}
          fetchHierarchy={fetchHierarchy}
        />,
      );
    });

    it('When sites are not loaded it calls fetchHierarchy', () => {
      expect(fetchHierarchy.callCount).to.equal(1);
    });

    it('When sites are not loaded it does NOT call fetchAuth', () => {
      expect(fetchAuth.callCount).to.equal(0);
    });

    it('Should have a loading container', () => {
      expect(mountedComponent.find('.loading__container')).to.have.length(1);
    });
  });


  describe('Site Error | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    beforeEach(() => {
      fetchAuth = sinon.spy();
      fetchHierarchy = sinon.spy();
      mountedComponent = mountWithTheme(reduxWrap(
        <Application
          {...defaultProps}
          siteError
        />,
      ));
    });

    it('When an error occurs it should not call API', () => {
      expect(fetchAuth.callCount).to.equal(0);
      expect(fetchHierarchy.callCount).to.equal(0);
    });

    it('Should have an error container', () => {
      expect(mountedComponent.find(Modal).props().title).to.equal('Error');
    });
  });


  describe('No User Data | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    beforeEach(() => {
      fetchAuth = sinon.spy();
      fetchHierarchy = sinon.spy();
      mountedComponent = mountWithTheme(reduxWrap(
        <Application
          {...defaultProps}
          user={{ id: -1, username: undefined, ip: undefined, admin: false }}
          fetchAuth={fetchAuth}
          fetchHierarchy={fetchHierarchy}
        />,
      ));
    });

    it('When auth not loaded it calls fetchAuth', () => {
      expect(fetchAuth.callCount).to.equal(1);
    });

    it('When auth not loaded it does NOT call fetchHierarchy', () => {
      expect(fetchHierarchy.callCount).to.equal(0);
    });

    it('Should have a loading container', () => {
      expect(mountedComponent.find('.loading__container')).to.have.length(1);
    });
  });


  describe('User Error | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    beforeEach(() => {
      fetchAuth = sinon.spy();
      fetchHierarchy = sinon.spy();
      mountedComponent = mountWithTheme(reduxWrap(
        <Application
          {...defaultProps}
          userError
        />,
      ));
    });

    it('When an error occurs it should not call API', () => {
      expect(fetchAuth.callCount).to.equal(0);
      expect(fetchHierarchy.callCount).to.equal(0);
    });

    it(' Should have an error container', () => {
      expect(mountedComponent.find(Modal).props().title).to.equal('Error');
    });
  });

  describe('Container | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    beforeEach(() => {
      moxios.install();
      mountedComponent = mountWithTheme(reduxWrap(
        <ApplicationContainer {...defaultProps} location={{ pathname: '/' }} />,
      ));
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('renders something & has correct containers', () => {
      moxios.withMock(() => {
        expect(mountedComponent).to.exist;
        expect(mountedComponent.find('Provider')).to.have.length(1);
      });
    });
  });

  describe('Modal | >>>', () => {
    beforeEach(() => {
      const modal: IModal = { showModal: true, component: <h1>Test Modal</h1> };
      component = shallow(
        <Application
          {...defaultProps}
          modal={modal}
        />,
      );
    });

    it('renders a modal when shown', () => {
      expect(component.contains(<h1>Test Modal</h1>)).to.equal(true);
    });
  });

  describe('Non-Hierarchy | >>>', () => {
    beforeEach(() => {
      component = shallow(
        <Application
          {...defaultProps}
          location={{ pathname: undefined }}
        />,
      );
    });

    it('correctly defines hierarchy as undefined if it does not exist', () => {
      expect(component).to.exist;
      const navProps: any = component.find('Navbar').props();
      expect(navProps.hierarchy).to.deep.equal({
        site: undefined,
        department: undefined,
        machine: undefined,
      });
    });
  });
});
