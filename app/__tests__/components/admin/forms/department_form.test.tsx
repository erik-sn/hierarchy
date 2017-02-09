import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import { mountWithTheme, reduxWrap } from '../../../../__tests__/helper';
import DepartmentConnected, { DepartmentForm,
  IDepartmentFormProps } from '../../../../src/components/admin/forms/department_form';
import { IModule, ISite } from '../../../../src/constants/interfaces';

const siteList: ISite[] = require('../../../sites.json');

const modules: IModule[] = [
  { name: 'module1', id: 1, label: 'module1', description: 'first', active: true },
  { name: 'module2', id: 2, label: 'module2', description: 'second', active: false },
  { name: 'module3', id: 3, label: 'module3', description: 'third', active: true },
];

describe('admin_department_form.test.js |', () => {
  let component: ShallowWrapper<{}, {}>;
  let handleSubmit: sinon.SinonSpy;
  let change: sinon.SinonSpy;
  let cancel: sinon.SinonSpy;
  let reset: sinon.SinonSpy;

  describe('Default | >>>', () => {
    const props: IDepartmentFormProps = {
      department: siteList[0].departments[0],
      modules,
      submitForm: (form) => undefined,
      change: undefined,
      handleSubmit: undefined,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      cancel = sinon.spy();
      reset = sinon.spy();
      component = shallow(
        <DepartmentForm
          {...props}
          handleSubmit={handleSubmit}
          change={change}
          cancel={cancel}
          reset={reset}
        />,
      );
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('has the correct elements', () => {
      expect(component.find('Field')).to.have.length(3);
      expect(component.find('FlatButton')).to.have.length(2);
      expect(component.find('ModuleEdit')).to.have.length(1);
    });

    it('has the correct button labels', () => {
      expect(component.find('FlatButton').at(1).props().label).to.equal('Cancel');
      expect(component.find('FlatButton').at(0).props().label).to.equal('Update');
    });

    it('calls cancel on cancel click', () => {
      component.find('FlatButton').at(1).simulate('click');
      expect(cancel.callCount).to.equal(1);
      expect(reset.callCount).to.equal(1);
    });

    it('calls handleSubmit on form submit', () => {
      component.find('FlatButton').at(0).simulate('click');
      expect(handleSubmit.callCount).to.equal(1);
    });
  });

  describe('Modal | >>>', () => {
    const props: IDepartmentFormProps = {
      department: undefined,
      modules,
      submitForm: (form) => undefined,
      change: undefined,
      handleSubmit: undefined,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      component = shallow(<DepartmentForm {...props} handleSubmit={handleSubmit} />);
    });

    it('1. submit button has the label Create when in a modal', () => {
      expect(component.find('FlatButton').at(0).props().label).to.equal('Create');
    });

    it('2. has no ModuleEdit in modal mode', () => {
      expect(component.find('ModuleEdit')).to.have.length(0);
    });
  });

  describe('Connected to redux and redux-form | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    const props: IDepartmentFormProps = {
      department: siteList[0].departments[0],
      modules,
      submitForm: (form) => undefined,
      change: undefined,
      handleSubmit: undefined,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      mountedComponent = mountWithTheme(reduxWrap(
        <DepartmentConnected
          {...props}
          handleSubmit={handleSubmit}
          change={change}
          modules={modules}
        />,
      ));
    });

    it('renders something & has correct containers', () => {
      expect(mountedComponent).to.have.length(1);
      expect(mountedComponent.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });

  describe('Connected to redux - department undefined| >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    const props: IDepartmentFormProps = {
      department: undefined,
      modules,
      submitForm: (form) => undefined,
      change: undefined,
      handleSubmit: undefined,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      mountedComponent = mountWithTheme(reduxWrap(
        <DepartmentConnected
          {...props}
          handleSubmit={handleSubmit}
          change={change}
          modules={modules}
        />,
      ));
    });

    it('renders something & has correct containers', () => {
      expect(mountedComponent).to.have.length(1);
      expect(mountedComponent.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });
});
