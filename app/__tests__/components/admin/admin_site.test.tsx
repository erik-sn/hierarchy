import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as moxios from 'moxios';
import * as React from 'react';
import * as sinon from 'sinon';

import AdminSite, { IAdminSiteProps } from '../../../src/components/admin/admin_site';
import { IApiCall, IModule, ISite } from '../../../src/constants/interfaces';

const siteList: ISite[] = require('../../sites.json');

describe('admin_site.test.tsx |', () => {
  const modules: IModule[] = [
    { name: 'module1', id: 1, label: 'module1', description: 'first', active: true },
    { name: 'module2', id: 2, label: 'module2', description: 'second', active: false },
    { name: 'module3', id: 3, label: 'module3', description: 'third', active: true },
  ];
  const apicalls: IApiCall[] = [
    { id: 1, key: 'one', url: '/hello', description: 'first', active: false },
    { id: 2, key: 'two', url: '/world', description: 'second', active: true },
    { id: 3, key: 'three', url: '/end', description: 'third', active: true },
  ];
  describe('Default | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let navigate: sinon.SinonSpy;
    const props: IAdminSiteProps = {
      site: siteList[0],
      splat: '/atl/',
      fetchHierarchy: undefined,
      navigate: undefined,
    };

    beforeEach(() => {
      navigate = sinon.spy();
      component = shallow(<AdminSite {...props} navigate={navigate} />);
      component.setState({ modules, apicalls });
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__site-container')).to.have.length(1);
    });

    it('has the correct elements', () => {
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
      expect(component.find('CardTitle')).to.have.length(1);
      expect(component.find('List')).to.have.length(1);
      expect(component.find('ListItem')).to.have.length(3);
      expect(component.find('.admin__site-content-')).to.have.length(1);
    });

    it('calls navigate on site-options click', () => {
      expect(navigate.callCount).to.equal(0);
      component.find('ListItem').at(0).simulate('click');
      component.find('ListItem').at(1).simulate('click');
      component.find('ListItem').at(2).simulate('click');
      expect(navigate.callCount).to.equal(3);
    });
  });

  describe('modules/apicalls are undefined | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let navigate: sinon.SinonSpy;
    const props: IAdminSiteProps = {
      site: siteList[0],
      splat: '/atl/',
      fetchHierarchy: undefined,
      navigate: undefined,
    };

    beforeEach(() => {
      navigate = sinon.spy();
      component = shallow(<AdminSite {...props} navigate={navigate} />);
      component.setState({ modules: undefined, apicalls: undefined });
    });

    it(`does not throw an error if renderConfig is called
        andmodules/apicalls are not defined`, () => undefined);
  });

  describe('Departments | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let navigate: sinon.SinonSpy;
    const props: IAdminSiteProps = {
      site: siteList[0],
      splat: '/atl/departments',
      fetchHierarchy: undefined,
      navigate: undefined,
    };

    beforeEach(() => {
      navigate = sinon.spy();
      component = shallow(<AdminSite {...props} navigate={navigate} />);
      component.setState({ modules, apicalls });
    });

    it('renders a department screen', () => {
      expect(component.find('.admin__site-content-departments')).to.have.length(1);
      expect(component.find('Department')).to.have.length(1);
    });
  });

  describe('Machines | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let navigate: sinon.SinonSpy;
    const props: IAdminSiteProps = {
      site: siteList[0],
      splat: '/atl/machines',
      fetchHierarchy: undefined,
      navigate: undefined,
    };

    beforeEach(() => {
      navigate = sinon.spy();
      component = shallow(<AdminSite {...props} navigate={navigate} />);
      component.setState({ modules, apicalls });
    });

    it('renders a department screen', () => {
      expect(component.find('.admin__site-content-machines')).to.have.length(1);
      expect(component.find('MachineAdmin')).to.have.length(1);
    });
  });

  describe('Functions | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let fetchHierarchy: sinon.SinonSpy;
    const props: IAdminSiteProps = {
      site: siteList[0],
      splat: '/atl/machines',
      fetchHierarchy: undefined,
      navigate: undefined,
    };

    beforeEach(() => {
      moxios.install();
      fetchHierarchy = sinon.spy();
      component = shallow(<AdminSite {...props} fetchHierarchy={fetchHierarchy} />);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('fetches modules and apicalls on componentDidMount', () => {
      const fetchModules: sinon.SinonSpy = sinon.spy();
      const fetchApiCalls: sinon.SinonSpy = sinon.spy();
      const instance: any = component.instance();
      instance.fetchModules = fetchModules;
      instance.fetchApiCalls = fetchApiCalls;

      instance.componentDidMount();
      expect(fetchModules.callCount).to.equal(1);
      expect(fetchApiCalls.callCount).to.equal(1);
    });

    it('populates modules', (done) => {
      const initialState: any = component.state();
      expect(initialState.modules).to.equal(undefined);

      const instance: any = component.instance();
      instance.fetchModules();
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 200,
          response: modules,
        }).then(() => {
          const finalState: any = component.state();
          expect(finalState.modules).to.deep.equal(modules);
          done();
        });
      });
    });

    it('populates apiCalls', (done) => {
      const initialState: any = component.state();
      expect(initialState.apicalls).to.equal(undefined);

      const instance: any = component.instance();
      instance.fetchApiCalls();
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 200,
          response: apicalls,
        }).then(() => {
          const finalState: any = component.state();
          expect(finalState.apicalls).to.deep.equal(apicalls);
          done();
        });
      });
    });

    it('shows an error when modules fail to load', (done) => {
      const initialState: any = component.state();
      expect(initialState.modules).to.equal(undefined);

      const instance: any = component.instance();
      instance.fetchModules();

      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          const finalState: any = component.state();
          expect(finalState.messageShow).to.equal(true);
          expect(finalState.messageText).to.equal('Error Loading Modules');
          done();
        });
      });
    });

    it('shows an error when apicalls fail to load', (done) => {
      const initialState: any = component.state();
      expect(initialState.apicalls).to.equal(undefined);

      const instance: any = component.instance();
      instance.fetchApiCalls();

      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          const finalState: any = component.state();
          expect(finalState.messageShow).to.equal(true);
          expect(finalState.messageText).to.equal('Error Loading Api Calls');
          done();
        });
      });
    });

    it('correctly updates state to show message on successfull updateSite', (done) => {
      const instance: any = component.instance();
      instance.updateSite(siteList[0]);

      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 200,
          response: siteList[0],
        }).then(() => {
          const state: any = component.state();
          expect(fetchHierarchy.callCount).to.equal(1);
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal(`Site Successfully Updated: ${siteList[0].name}`);
          done();
        });
      });
    });

    it('shows an error message on fail', (done) => {
      const instance: any = component.instance();
      instance.updateSite(siteList[0]);
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 401,
          response: siteList[0],
        }).then(() => {
          const state: any = component.state();
          expect(fetchHierarchy.callCount).to.equal(0);
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal(`Error Updating Site: ${siteList[0].name}`);
          done();
        });
      });
    });

    it('sets state correctly on handleMessageClose', () => {
      component.setState({ messageShow: true });
      const instance: any = component.instance();
      instance.handleMessageClose();

      const state: any = component.state();
      expect(state.messageShow).to.equal(false);
    });
  });
});
