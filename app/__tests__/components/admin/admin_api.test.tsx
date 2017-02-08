import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as moxios from 'moxios';
import * as React from 'react';

import { mountWithTheme, reduxWrap } from '../../../__tests__/helper';
import ApiAdminConnected, { ApiCallAdmin, IApiCallsProps } from '../../../src/components/admin/admin_api';
import Loader from '../../../src/components/loader';
import Modal from '../../../src/components/modal';
import { IApiCall, ISite } from '../../../src/constants/interfaces';

describe('admin_api.test.tsx |', () => {
  const apiCalls: IApiCall[] = [
    { key: 'api1', id: 1, url: 'module1', description: 'first', active: true },
    { key: 'api2', id: 2, url: 'module2', description: 'second', active: false },
    { key: 'api3', id: 3, url: 'module3', description: 'third', active: true },
  ];
  const newApiCall: IApiCall = {
    key: 'api4',
    id: 4,
    url: 'module4',
    description: 'four',
    active: true,
  };
  describe('Default | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props = {
    };

    beforeEach(() => {
      moxios.install();
      component = shallow(<ApiCallAdmin {...props} />);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.admin__apicalls')).to.have.length(1);
    });

    it('shows a loader if state.apiCalls is undefined', () => {
      expect(component.find(Loader)).to.have.length(1);
    });

    it('alters the state correctly on successful createApiCall call', (done) => {
      component.setState({ apiCalls });
      expect(component.find('Snackbar').props().open).to.equal(false);

      const instance: any = component.instance();
      instance.createApiCall(newApiCall);
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 201,
          response: newApiCall,
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('API call Successfully Created: api4');
          done();
        });
      });
    });

    it('alters the state correctly on createApiCall failure', (done) => {
      component.setState({ apiCalls });
      expect(component.find('Snackbar').props().open).to.equal(false);

      const instance: any = component.instance();
      instance.createApiCall(newApiCall);
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('Error Creating API call: api4');
          done();
        });
      });
    });

    it('alters the state correctly on successful updateApiCall call', (done) => {
      component.setState({ apiCalls, activeApiCall: apiCalls[0] });
      component.setProps({ apiCall: newApiCall });

      const instance: any = component.instance();
      instance.updateApiCall();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: newApiCall,
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('API call Successfully Updated: api4');
          done();
        });
      });
    });

    it('alters the state correctly on updateModule failure', (done) => {
      component.setState({ apiCalls, activeApiCall: apiCalls[0] });
      component.setProps({ apiCall: newApiCall });
      expect(component.find('Snackbar').props().open).to.equal(false);

      const instance: any = component.instance();
      instance.updateApiCall();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: apiCalls[0],
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('Error Updating API call: api4');
          done();
        });
      });
    });

    it('alters the state correctly on successful deleteModule call', (done) => {
      component.setState({ apiCalls, activeApiCall: apiCalls[0] });
      expect(component.find('Snackbar').props().open).to.equal(false);
      const instance: any = component.instance();
      instance.deleteApiCall();
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 204,
          response: undefined,
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('API call Successfully Deleted: api1');
          done();
        });
      });
    });

    it('alters the state correctly on deleteModule failure', (done) => {
      component.setState({ apiCalls, activeApiCall: apiCalls[0] });
      expect(component.find('Snackbar').props().open).to.equal(false);
      const instance: any = component.instance();
      instance.deleteApiCall();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: undefined,
        }).then(() => {
          const state: any = component.state();
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('Error Deleting API call: api1');
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
      expect(initialState.apiCalls).to.equal(undefined);

      const instance: any = component.instance();
      instance.componentDidMount();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: apiCalls,
        }).then(() => {
          const finalState: any = component.state();
          expect(finalState.apiCalls).to.deep.equal(apiCalls);
          done();
        });
      });
    });

    it('toggles state on toggleShowNewForm call', () => {
      const instance: any = component.instance();
      instance.toggleShowNewForm();
      const state: any = component.state();
      expect(state.activeApiCall).to.equal(undefined);
      expect(state.showNewForm).to.be.true;
    });
  });

  describe('ApiCalls Loaded | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props = {
    };

    beforeEach(() => {
      component = shallow(<ApiCallAdmin {...props} />);
      component.setState({ apiCalls });
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.admin__apicalls')).to.have.length(1);
    });

    it('shows a loader if state.apiCalls is undefined', () => {
      expect(component.find('List')).to.have.length(1);
      expect(component.find('ListItem')).to.have.length(3);
    });

    it('shows a form when active module is set', () => {
      component.find('ListItem').at(0).simulate('click');
      const state: any = component.state();
      expect(state.activeApiCall).to.deep.equal(apiCalls[0]);
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });

    it('sets the filter based on the input event change', () => {
      const event: any = {
        currentTarget: { value: 'test_value' },
      };
      component.find('TextField').simulate('change', event);
      const state: any = component.state();
      expect(state.filter).to.equal('test_value');
    });

    it('does not filter if there is an empty input in the search box', () => {
      const event: any = {
        currentTarget: { value: '  ' },
      };
      component.find('TextField').simulate('change', event);
    });
  });

  describe('ApiCalls Loaded and showNewForm is true | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props = {
    };

    beforeEach(() => {
      component = shallow(<ApiCallAdmin {...props} />);
      component.setState({ apiCalls, showNewForm: true });
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
      component = mountWithTheme(reduxWrap(<ApiAdminConnected {...props} />));
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.admin__apicalls')).to.have.length(1);
    });
  });
});
