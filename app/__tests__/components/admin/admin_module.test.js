import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { is, List, Map } from 'immutable';
import moxios from 'moxios';

import { reduxWrap, mountWithTheme } from '../../../__test__/helper';
import ModuleConnected, { Modules } from '../../../src/components/admin/admin_module';

describe('admin_module.test.js |', () => {
  const modules = List([
    Map({ name: 'module1', id: 1 }),
    Map({ name: 'module2', id: 2 }),
    Map({ name: 'module3', id: 3 }),
  ]);
  describe('Default | >>>', () => {
    let component;
    const props = {
    };

    beforeEach(() => {
      moxios.install();
      component = shallow(<Modules {...props} />);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__modules')).to.have.length(1);
    });

    it('2. shows a loader if state.modules is undefined', () => {
      expect(component.find('Loader')).to.have.length(1);
    });

    it('3. alters the state correctly on successful createModule call', (done) => {
      component.setState({ modules });
      expect(component.find('Snackbar').props().open).to.equal(false);
      const module = Map({ name: 'test_module', description: 'test1', active: true });
      component.instance().createModule(module);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: module,
        }).then(() => {
          expect(component.state().messageShow).to.equal(true);
          expect(component.state().messageText).to.equal('Module Successfully Created: test_module');
          done();
        });
      });
    });

    it('4. alters the state correctly on createModule failure', (done) => {
      component.setState({ modules });
      expect(component.find('Snackbar').props().open).to.equal(false);
      const module = Map({ name: 'test_module', description: 'test1', active: true });
      component.instance().createModule(module);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: module,
        }).then(() => {
          expect(component.state().messageShow).to.equal(true);
          expect(component.state().messageText).to.equal('Error Creating Module: test_module');
          done();
        });
      });
    });

    it('5. alters the state correctly on successful updateModule call', (done) => {
      component.setState({ modules, activeModule: modules.get(0) });
      expect(component.find('Snackbar').props().open).to.equal(false);
      component.instance().updateModule();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: modules.get(0),
        }).then(() => {
          expect(component.state().messageShow).to.equal(true);
          expect(component.state().messageText).to.equal('Module Successfully Updated: module1');
          done();
        });
      });
    });

    it('6. alters the state correctly on updateModule failure', (done) => {
      component.setState({ modules, activeModule: modules.get(0) });
      expect(component.find('Snackbar').props().open).to.equal(false);
      component.instance().updateModule();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: modules.get(0),
        }).then(() => {
          expect(component.state().messageShow).to.equal(true);
          expect(component.state().messageText).to.equal('Error Updating Module: module1');
          done();
        });
      });
    });

    it('7. alters the state correctly on successful deleteModule call', (done) => {
      component.setState({ modules, activeModule: modules.get(0) });
      expect(component.find('Snackbar').props().open).to.equal(false);
      component.instance().deleteModule();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 204,
          response: undefined,
        }).then(() => {
          expect(component.state().messageShow).to.equal(true);
          expect(component.state().messageText).to.equal('Module Successfully Deleted: module1');
          done();
        });
      });
    });

    it('8. alters the state correctly on deleteModule failure', (done) => {
      component.setState({ modules, activeModule: modules.get(0) });
      expect(component.find('Snackbar').props().open).to.equal(false);
      component.instance().deleteModule();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          expect(component.state().messageShow).to.equal(true);
          expect(component.state().messageText).to.equal('Error Deleting Module: module1');
          done();
        });
      });
    });

    it('8. resets state.messageShow on handleMessageClose', () => {
      component.setState({ messageShow: true });
      component.instance().handleMessageClose();
      expect(component.state().messageShow).to.equal(false);
    });

    it('9. populates modules on componentDidMount', (done) => {
      expect(component.state().modules).to.equal(undefined);
      component.instance().componentDidMount();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: modules,
        }).then(() => {
          expect(is(component.state().modules, modules)).to.equal(true);
          done();
        });
      });
    });
  });

  describe('Modules Loaded | >>>', () => {
    let component;
    const props = {
    };

    beforeEach(() => {
      component = shallow(<Modules {...props} />);
      component.setState({ modules });
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__modules')).to.have.length(1);
    });

    it('2. shows a loader if state.modules is undefined', () => {
      expect(component.find('List')).to.have.length(1);
      expect(component.find('ListItem')).to.have.length(3);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });

    it('3. shows a form when active module is set', () => {
      component.find('ListItem').at(0).simulate('click');
      expect(is(component.state().activeModule, modules.get(0))).to.equal(true);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });

  describe('connects to redux state | >>>', () => {
    let component;
    const props = {
    };

    beforeEach(() => {
      component = mountWithTheme(reduxWrap(<ModuleConnected {...props} />));
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__modules')).to.have.length(1);
      expect(component.find('Modules').props().values).to.deep.equal({});
    });
  });
});
