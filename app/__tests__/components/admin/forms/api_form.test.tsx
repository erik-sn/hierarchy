import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import { mountWithTheme, reduxWrap } from '../../../../__tests__/helper';
import ApiFormConnected, { ApiForm,
  IApiFormProps } from '../../../../src/components/admin/forms/api_form';
import { IApiCall, ISite } from '../../../../src/constants/interfaces';

const siteList: ISite[] = require('../../../sites.json');

const apicalls: IApiCall[] = [
  { key: 'api1', id: 1, url: 'module1', description: 'first', active: true },
  { key: 'api2', id: 2, url: 'module2', description: 'second', active: false },
  { key: 'api3', id: 3, url: 'module3', description: 'third', active: true },
];

describe('api_form.test.tsx |', () => {
  let component: ShallowWrapper<{}, {}>;
  let handleSubmit: sinon.SinonSpy;
  let submitForm: sinon.SinonSpy;
  let cancel: sinon.SinonSpy;
  let change: sinon.SinonSpy;
  let reset: sinon.SinonSpy;
  let remove: sinon.SinonSpy;

  describe('Default | >>>', () => {

    beforeEach(() => {
      handleSubmit = sinon.spy();
      cancel = sinon.spy();
      change = sinon.spy();
      reset = sinon.spy();
      remove = sinon.spy();
      submitForm = sinon.spy();
      const spies = { cancel, handleSubmit, change, reset, submitForm, remove };
      component = shallow(
        <ApiForm
          {...spies}
          apiCall={apicalls[0]}
        />,
      );
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('renders correct elements', () => {
      expect(component.find('Field')).to.have.length(4);
      expect(component.find('FlatButton')).to.have.length(4);
    });

    it('calls update and reset on update button click', () => {
      component.find('FlatButton').at(0).simulate('click');
      expect(handleSubmit.callCount).to.equal(1);
    });

    it('calls remove and reset on clear button click', () => {
      component.find('FlatButton').at(2).simulate('click');
      expect(change.callCount).to.equal(4);
    });

    it('componentWillReceiveProps without props doesnt reset', () => {
      const instance: any = component.instance();
      instance.componentWillReceiveProps({});
      expect(change.callCount).to.equal(0);
    });

    it('componentWillReceiveProps calls change on all fields', () => {
      const instance: any = component.instance();
      instance.componentWillReceiveProps({
        apiCall: apicalls[1],
        change,
      });
      expect(change.callCount).to.equal(5);
    });

    it('componentWillReceiveProps does not call change if same module', () => {
      const instance: any = component.instance();
      instance.componentWillReceiveProps({
        apiCall: apicalls[0],
        change,
      });
      expect(change.callCount).to.equal(0);
    });

    it('calls cancel and reset on handleCancel', () => {
      const instance: any = component.instance();
      instance.handleCancel();
      expect(cancel.callCount).to.equal(1);
      expect(reset.callCount).to.equal(2);
    });
  });

  describe('Clean form | >>>', () => {
    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      reset = sinon.spy();
      remove = sinon.spy();
      submitForm = sinon.spy();
      const spies = { handleSubmit, change, reset, submitForm, remove };
      component = shallow(
        <ApiForm
          {...spies}
        />,
      );
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('2. renders correct elements', () => {
      expect(component.find('Field')).to.have.length(4);
      expect(component.find('FlatButton')).to.have.length(2);
    });
  });


  describe('Connects to redux | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      reset = sinon.spy();
      submitForm = sinon.spy();
      const spies = { handleSubmit, change, reset, submitForm };
      mountedComponent = mountWithTheme(reduxWrap(
        <ApiFormConnected
          {...spies}
          apiCall={apicalls[0]}
        />,
      ));
    });

    it('1. renders something & has correct containers', () => {
      expect(mountedComponent).to.have.length(1);
      expect(mountedComponent.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });

  describe('Connects to redux with clean | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      reset = sinon.spy();
      submitForm = sinon.spy();
      const spies = { handleSubmit, change, reset, submitForm };
      mountedComponent = mountWithTheme(reduxWrap(
        <ApiFormConnected
          {...spies}
        />,
      ));
    });

    it('1. renders something & has correct containers', () => {
      expect(mountedComponent).to.have.length(1);
      expect(mountedComponent.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });
});
