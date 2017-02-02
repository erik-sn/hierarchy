import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as moxios from 'moxios';
import * as React from 'react';
import * as sinon from 'sinon';

import Department from '../../../src/components/admin/admin_department';
import { ISite } from '../../../src/constants/interfaces';

const siteList: ISite[] = require('../../sites.json');

describe('admin_department.test.js |', () => {
  const department = siteList[0].departments[0];
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let message: sinon.SinonSpy;
    let fetchHierarchy: sinon.SinonSpy;
    const props = {
      site: siteList[0],
      modules: department.modules,
    };

    beforeEach(() => {
      moxios.install();
      message = sinon.spy();
      fetchHierarchy = sinon.spy();
      const spies: any = { message, fetchHierarchy };
      component = shallow(<Department {...props} {...spies} />);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__department-container')).to.have.length(1);
    });

    it('has the correct elements', () => {
      expect(component.find('SelectField')).to.have.length(1);
      expect(component.find('MenuItem')).to.have.length(2);
      expect(component.find('FlatButton')).to.have.length(1);
    });

    it('opens a modal with the department form on add department click', () => {
      component.find('FlatButton').simulate('click');
      expect(component.find('Connect(Component)')).to.have.length(1);
      expect(component.find('Connect(Component)').props().title).to.equal('Create New Department');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
    });

    it('closes modal on cancel click', () => {
      component.find('FlatButton').simulate('click');
      const modal: any = component.find('Connect(Component)').props();
      const cancel: any = modal.onCancel;
      cancel();
      component.setState({ showNewDepartment: false });
      expect(component.find('Connect(Modal)')).to.have.length(0);
    });

    it('set the menu items value in the select box and show the department form', () => {
      console.log(component.debug())
      component.find('MenuItem').simulate('click');
      console.log(component.debug())
      expect(component.find('SelectField').props().value).to.equal('Extrusion');
      expect(component.find('Connect(ReduxForm)')).to.have.length(1);
      expect(component.find('FlatButton')).to.have.length(0);
    });

    // it('6. alters the state correctly on successful createDepartment call', (done) => {
    //   component.instance().createDepartment(Map({ name: 'test' }));
    //   moxios.wait(() => {
    //     const request = moxios.requests.mostRecent();
    //     request.respondWith({
    //       status: 201,
    //       response: department,
    //     }).then(() => {
    //       expect(message.callCount).to.equal(1);
    //       expect(message.args[0][0]).to.equal('Department Successfully Created: test');
    //       expect(fetchHierarchy.callCount).to.equal(1);
    //       done();
    //     });
    //   });
    // });

    // it('7. calls message with an error message on createDepartment fail', (done) => {
    //   component.instance().createDepartment(Map({ name: 'test' }));
    //   moxios.wait(() => {
    //     const request = moxios.requests.mostRecent();
    //     request.respondWith({
    //       status: 401,
    //       response: undefined,
    //     }).then(() => {
    //       expect(message.callCount).to.equal(1);
    //       expect(message.args[0][0]).to.equal('Error Creating Department: test');
    //       expect(fetchHierarchy.callCount).to.equal(0);
    //       done();
    //     });
    //   });
    // });

    // it('8. alters the state correctly on successful updateDepartment call', (done) => {
    //   component.setState({ department });
    //   component.instance().updateDepartment(Map({ name: 'test' }));
    //   moxios.wait(() => {
    //     const request = moxios.requests.mostRecent();
    //     request.respondWith({
    //       status: 201,
    //       response: department,
    //     }).then(() => {
    //       expect(message.callCount).to.equal(1);
    //       expect(message.args[0][0]).to.equal('Department Successfully Updated: test');
    //       expect(fetchHierarchy.callCount).to.equal(1);
    //       expect(component.state().department).to.equal(undefined);
    //       done();
    //     });
    //   });
    // });

    // it('9. calls message with an error message on updateDepartment fail', (done) => {
    //   component.setState({ department });
    //   component.instance().updateDepartment(Map({ name: 'test' }));
    //   moxios.wait(() => {
    //     const request = moxios.requests.mostRecent();
    //     request.respondWith({
    //       status: 401,
    //       response: undefined,
    //     }).then(() => {
    //       expect(message.callCount).to.equal(1);
    //       expect(message.args[0][0]).to.equal('Error Updating Department: test');
    //       expect(fetchHierarchy.callCount).to.equal(0);
    //       expect(component.state().department).to.equal(undefined);
    //       done();
    //     });
    //   });
    // });
  });
});
