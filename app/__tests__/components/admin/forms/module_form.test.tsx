import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import { mountWithTheme, reduxWrap } from '../../../../__tests__/helper';
import ModuleFormConnected, { IModuleFormProps,
  ModuleForm } from '../../../../src/components/admin/forms/module_form';
import { IModule, ISite } from '../../../../src/constants/interfaces';

const siteList: ISite[] = require('../../../sites.json');

const modules: IModule[] = [
  { name: 'module1', id: 1, label: 'module1', description: 'first', active: true },
  { name: 'module2', id: 2, label: 'module2', description: 'second', active: false },
  { name: 'module3', id: 3, label: 'module3', description: 'third', active: true },
];

describe('module_form.test.tsx |', () => {
  let component: ShallowWrapper<{}, {}>;
  let handleSubmit: sinon.SinonSpy;
  let submitForm: sinon.SinonSpy;
  let change: sinon.SinonSpy;
  let reset: sinon.SinonSpy;
  let remove: sinon.SinonSpy;

  describe('Default | >>>', () => {

    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      reset = sinon.spy();
      remove = sinon.spy();
      submitForm = sinon.spy();
      const spies = { handleSubmit, change, reset, submitForm, remove };
      component = shallow(
        <ModuleForm
          {...spies}
          module={modules[0]}
        />,
      );
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('renders correct elements', () => {
      expect(component.find('Field')).to.have.length(4);
      expect(component.find('FlatButton')).to.have.length(3);
    });

    it('calls update and reset on update button click', () => {
      component.find('FlatButton').at(0).simulate('click');
      expect(handleSubmit.callCount).to.equal(1);
    });

    it('calls remove and reset on clear button click', () => {
      const props: any = component.find('FlatButton').at(1).props();
      expect(props.label).to.equal('Delete');

      component.find('FlatButton').at(1).simulate('click');
      expect(remove.callCount).to.equal(1);
      expect(reset.callCount).to.equal(2);
    });

    it('calls change on all fields on clear click', () => {
      const props: any = component.find('FlatButton').at(2).props();
      expect(props.label).to.equal('Clear');

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
        module: modules[1],
        change,
      });
      expect(change.callCount).to.equal(4);
    });

    it('componentWillReceiveProps does not call change if same module', () => {
      const instance: any = component.instance();
      instance.componentWillReceiveProps({
        module: modules[0],
        change,
      });
      expect(change.callCount).to.equal(0);
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
        <ModuleForm
          {...spies}
        />,
      );
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('renders correct elements', () => {
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
        <ModuleFormConnected
          {...spies}
          module={modules[0]}
        />,
      ));
    });

    it('renders something & has correct containers', () => {
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
        <ModuleFormConnected
          {...spies}
        />,
      ));
    });

    it('renders something & has correct containers', () => {
      expect(mountedComponent).to.have.length(1);
      expect(mountedComponent.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });
});
