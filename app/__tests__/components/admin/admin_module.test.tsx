import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as moxios from 'moxios';
import * as React from 'react';

import { mountWithTheme, reduxWrap } from '../../../__tests__/helper';
import ModuleAdminConnected, { IModulesProps, ModuleAdmin } from '../../../src/components/admin/admin_module';
import Loader from '../../../src/components/loader';

describe('admin_module.test.js |', () => {
  const modules = [
    { name: 'module1', id: 1 },
    { name: 'module2', id: 2 },
    { name: 'module3', id: 3 },
  ];
  describe('Default | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props = {
    };

    beforeEach(() => {
      moxios.install();
      component = shallow(<ModuleAdmin {...props} />);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__modules')).to.have.length(1);
    });

    it('shows a loader if state.modules is undefined', () => {
      expect(component.find(Loader)).to.have.length(1);
    });

    it('alters the state correctly on successful createModule call', (done) => {
      component.setState({ modules });
      expect(component.find('Snackbar').props().open).to.equal(false);
      const module: any = { name: 'test_module', description: 'test1', active: true };
      component.setProps({ moduleForm: module });
      const instance: any = component.instance();
      instance.createModule();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: module,
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('Module Successfully Created: test_module');
          done();
        });
      });
    });

    it('alters the state correctly on createModule failure', (done) => {
      component.setState({ modules });
      expect(component.find('Snackbar').props().open).to.equal(false);
      const module: any = { name: 'test_module', description: 'test1', active: true };
      component.setProps({ moduleForm: module });
      const instance: any = component.instance();
      instance.createModule();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: module,
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('Error Creating Module: test_module');
          done();
        });
      });
    });

    it('alters the state correctly on successful updateModule call', (done) => {
      component.setState({ modules, activeModule: modules[0] });
      const module: any = { name: 'test_module', description: 'test1', active: true };
      component.setProps({ moduleForm: module });
      const instance: any = component.instance();
      instance.updateModule();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: modules[0],
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('Module Successfully Updated: module1');
          done();
        });
      });
    });

    it('alters the state correctly on updateModule failure', (done) => {
      component.setState({ modules, activeModule: modules[0] });
      expect(component.find('Snackbar').props().open).to.equal(false);
      component.setProps({ moduleForm: {} });
      const instance: any = component.instance();
      instance.updateModule();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: modules[0],
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('Error Updating Module: module1');
          done();
        });
      });
    });

    it('alters the state correctly on successful deleteModule call', (done) => {
      component.setState({ modules, activeModule: modules[0] });
      expect(component.find('Snackbar').props().open).to.equal(false);
      const instance: any = component.instance();
      instance.deleteModule();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 204,
          response: undefined,
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('Module Successfully Deleted: module1');
          done();
        });
      });
    });

    it('alters the state correctly on deleteModule failure', (done) => {
      component.setState({ modules, activeModule: modules[0] });
      expect(component.find('Snackbar').props().open).to.equal(false);
      const instance: any = component.instance();
      instance.deleteModule();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('Error Deleting Module: module1');
          done();
        });
      });
    });

    it('resets state.messageShow on handleMessageClose', () => {
      component.setState({ messageShow: true });
      const instance: any = component.instance();
      instance.handleMessageClose();
      const state: any = component.state();
      expect(state.messageShow).to.equal(false);
    });

    it('populates modules on componentDidMount', (done) => {
      const initialState: any = component.state();
      expect(initialState.modules).to.equal(undefined);

      const instance: any = component.instance();
      instance.componentDidMount();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: modules,
        }).then(() => {
          const finalState: any = component.state();
          expect(finalState.modules).to.deep.equal(modules);
          done();
        });
      });
    });
  });

  describe('Modules Loaded | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props = {
    };

    beforeEach(() => {
      component = shallow(<ModuleAdmin {...props} />);
      component.setState({ modules });
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__modules')).to.have.length(1);
    });

    it('2. shows a loader if state.modules is undefined', () => {
      expect(component.find('List')).to.have.length(1);
      expect(component.find('ListItem')).to.have.length(3);
    });

    it('3. shows a form when active module is set', () => {
      component.find('ListItem').at(0).simulate('click');
      const state: any = component.state();
      expect(state.activeModule).to.deep.equal(modules[0]);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });

  describe('connects to redux state | >>>', () => {
    let component: ReactWrapper<{}, {}>;
    const props = {
    };

    beforeEach(() => {
      component = mountWithTheme(reduxWrap(<ModuleAdminConnected {...props} />));
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__modules')).to.have.length(1);
    });
  });
});
