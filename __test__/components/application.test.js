import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { fromJS, List, Map } from 'immutable';
import moxios from 'moxios';

import { reduxWrap, mountWithTheme } from '../helper';
import ApplicationContainer, { Application } from '../../src/components/application';


describe('application.test.js |', () => {
  let component;
  let fetchAuth;
  let fetchHierarchy;
  const defaultProps = Map({
    user: Map({ username: 'test_user', ip: '0.0.0.0' }),
    userError: false,
    sites: List(['site1', 'site2', 'site3']),
    siteError: false,
    location: { pathname: '/' },
    modal: Map({ showModal: false, component: undefined }),
  });

  describe('Expected | >>>', () => {
    beforeEach(() => {
      component = shallow(
        <Application
          sites={defaultProps.get('sites')}
          user={defaultProps.get('user')}
          modal={defaultProps.get('modal')}
          location={{ pathname: '/' }}
        >
          <h3>Child</h3>
        </Application>
      );
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('Navbar')).to.exist();
      expect(component.find('.application__content-container')).to.exist();
    });

    it('2. renders child components', () => {
      expect(component.find('h3').text()).to.equal('Child');
    });
  });

  describe('No Site Data | >>>', () => {
    beforeEach(() => {
      fetchAuth = sinon.spy();
      fetchHierarchy = sinon.spy();
      component = mountWithTheme(
        <Application
          user={defaultProps.get('user')}
          sites={List([])}
          fetchAuth={fetchAuth}
          fetchHierarchy={fetchHierarchy}
        />
      );
    });

    it('1. When sites are not loaded it calls fetchHierarchy', () => {
      expect(fetchHierarchy.callCount).to.equal(1);
    });

    it('2. When sites are not loaded it does NOT call fetchAuth', () => {
      expect(fetchAuth.callCount).to.equal(0);
    });

    it('3. Should have a loading container', () => {
      expect(component.find('.loading__container')).to.have.length(1);
    });
  });


  describe('Site Error | >>>', () => {
    beforeEach(() => {
      fetchAuth = sinon.spy();
      fetchHierarchy = sinon.spy();
      component = mountWithTheme(reduxWrap(
        <Application
          
          siteError
          fetchAuth={fetchAuth}
          fetchHierarchy={fetchHierarchy}
        />
      ));
    });

    it('1. When an error occurs it should not call API', () => {
      expect(fetchAuth.callCount).to.equal(0);
      expect(fetchHierarchy.callCount).to.equal(0);
    });

    it('3. Should have an error container', () => {
      expect(component.find('Modal').props().title).to.equal('Error');
    });
  });


  describe('No User Data | >>>', () => {
    beforeEach(() => {
      fetchAuth = sinon.spy();
      fetchHierarchy = sinon.spy();
      component = mountWithTheme(reduxWrap(
        <Application
          {...defaultProps}
          user={Map({ username: undefined, ip: undefined })}
          fetchAuth={fetchAuth}
          fetchHierarchy={fetchHierarchy}
        />
      ));
    });

    it('1. When auth not loaded it calls fetchAuth', () => {
      expect(fetchAuth.callCount).to.equal(1);
    });

    it('2. When auth not loaded it does NOT call fetchHierarchy', () => {
      expect(fetchHierarchy.callCount).to.equal(0);
    });

    it('3. Should have a loading container', () => {
      expect(component.find('.loading__container')).to.have.length(1);
    });
  });


  describe('User Error | >>>', () => {
    beforeEach(() => {
      fetchAuth = sinon.spy();
      fetchHierarchy = sinon.spy();
      component = mountWithTheme(reduxWrap(
        <Application
          {...defaultProps}
          userError
          fetchAuth={fetchAuth}
          fetchHierarchy={fetchHierarchy}
        />
      ));
    });

    it('1. When an error occurs it should not call API', () => {
      expect(fetchAuth.callCount).to.equal(0);
      expect(fetchHierarchy.callCount).to.equal(0);
    });

    it('3. Should have an error container', () => {
      expect(component.find('Modal').props().title).to.equal('Error');
    });
  });

  describe('Container | >>>', () => {
    beforeEach(() => {
      moxios.install();
      component = mountWithTheme(reduxWrap(<ApplicationContainer />));
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('1. renders something & has correct containers', () => {
      moxios.withMock(() => {
        expect(component).to.exist();
        expect(component.find('Provider')).to.have.length(1);
      });
    });
  });

  describe('Modal | >>>', () => {
    beforeEach(() => {
      const modal = fromJS({ showModal: true, component: <h1>Test Modal</h1> });
      component = shallow(
        <Application
          user={defaultProps.get('user')}
          sites={defaultProps.get('sites')}
          modal={modal}
        />
      );
    });

    it('1. renders a modal when shown', () => {
      expect(component.contains(<h1>Test Modal</h1>)).to.equal(true);
    });
  });
});
