import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as moxios from 'moxios';
import * as React from 'react';

import { mountWithTheme, reduxWrap } from '../../../__tests__/helper';
import ModuleAdminConnected, { IModulesProps, ModuleAdmin } from '../../../src/components/admin/admin_module';
import Loader from '../../../src/components/loader';
import Modal from '../../../src/components/modal';

describe('admin_module.test.tsx |', () => {
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

    it('toggles state on toggleShowNewForm call', () => {
      const instance: any = component.instance();
      instance.toggleShowNewForm();
      const state: any = component.state();
      expect(state.activeModule).to.equal(undefined);
      expect(state.showNewForm).to.be.true;
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

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__modules')).to.have.length(1);
    });

    it('shows a loader if state.modules is undefined', () => {
      expect(component.find('List')).to.have.length(1);
      expect(component.find('ListItem')).to.have.length(3);
    });

    it('sets the filter based on the input event change', () => {
      const preventDefault: any = (): any => undefined;
      const event: any = {
        preventDefault,
        currentTarget: { value: 'test_value' },
      };
      component.find('TextField').simulate('change', event);
      const state: any = component.state();
      expect(state.filter).to.equal('test_value');
    });

    it('shows a form when active module is set', () => {
      component.find('ListItem').at(0).simulate('click');
      const state: any = component.state();
      expect(state.activeModule).to.deep.equal(modules[0]);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });

  describe('modules loaded and showNewForm is true | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props = {
    };

    beforeEach(() => {
      component = shallow(<ModuleAdmin {...props} />);
      component.setState({ modules, showNewForm: true });
    });

    it('Has a modal object', () => {
      expect(component.find(Modal)).to.have.length(1);
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
