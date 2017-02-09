import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import { mountWithTheme, reduxWrap } from '../../../../__tests__/helper';
import MachineFormConnected, { IMachineFormProps,
  MachineForm } from '../../../../src/components/admin/forms/machine_form';
import { IModule, ISite } from '../../../../src/constants/interfaces';

const siteList: ISite[] = require('../../../sites.json');

const modules: IModule[] = [
  { name: 'module1', id: 1, label: 'module1', description: 'first', active: true },
  { name: 'module2', id: 2, label: 'module2', description: 'second', active: false },
  { name: 'module3', id: 3, label: 'module3', description: 'third', active: true },
];


describe('admin_machine_form.test.js |', () => {
  let component: ShallowWrapper<{}, {}>;
  let handleSubmit: sinon.SinonSpy;
  let change: sinon.SinonSpy;
  let cancel: sinon.SinonSpy;

  describe('Default | >>>', () => {
    const props: IMachineFormProps = {
      machine: siteList[0].departments[0].machines[0],
      modules,
      handleSubmit: undefined,
      submitForm: undefined,
      change: undefined,
      cancel: undefined,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      cancel = sinon.spy();
      const spies: any =  { handleSubmit, change, cancel };
      component = shallow(<MachineForm {...props} {...spies} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('has the correct elements', () => {
      expect(component.find('Field')).to.have.length(4);
      expect(component.find('FlatButton')).to.have.length(3);
      expect(component.find('ModuleEdit')).to.have.length(1);
    });

    it('has the correct button labels', () => {
      expect(component.find('FlatButton').at(0).props().label).to.equal('Update');
      expect(component.find('FlatButton').at(1).props().label).to.equal('Clear');
      expect(component.find('FlatButton').at(2).props().label).to.equal('Cancel');
    });

    it('calls change twice on clear click', () => {
      component.find('FlatButton').at(1).simulate('click');
      expect(change.callCount).to.equal(4);
    });

    it('calls handleSubmit on form submit', () => {
      component.find('FlatButton').at(0).simulate('click');
      expect(handleSubmit.callCount).to.equal(1);
    });

    it('calls cancel on cancelForm click', () => {
      component.find('FlatButton').at(2).simulate('click');
      expect(cancel.callCount).to.equal(1);
    });
  });

  describe('Modal | >>>', () => {
    const props: IMachineFormProps = {
      machine: undefined,
      modules,
      handleSubmit: undefined,
      submitForm: undefined,
      change: undefined,
      cancel: undefined,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      cancel = sinon.spy();
      const spies: any =  { handleSubmit, change, cancel };
      component = shallow(<MachineForm {...props} {...spies} />);
    });


    it('submit button has the label Create when in a modal', () => {
      expect(component.find('FlatButton').at(0).props().label).to.equal('Create');
    });

    it('has no ModuleEdit in modal mode', () => {
      expect(component.find('ModuleEdit')).to.have.length(0);
    });
  });

  describe('Connects to redux | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    const props: IMachineFormProps = {
      machine: siteList[0].departments[0].machines[0],
      modules,
      handleSubmit: undefined,
      submitForm: undefined,
      change: undefined,
      cancel: undefined,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      cancel = sinon.spy();
      const spies: any =  { handleSubmit, change, cancel };
      mountedComponent = mountWithTheme(reduxWrap(
        <MachineFormConnected
          {...props}
          handleSubmit={handleSubmit}
          change={change}
          modules={modules}
        />,
      ));
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.admin__form-container')).to.have.length(1);
    });
  });

  describe('Connects to redux in a modal | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    const props: IMachineFormProps = {
      machine: undefined,
      modules,
      handleSubmit: undefined,
      submitForm: undefined,
      change: undefined,
      cancel: undefined,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      change = sinon.spy();
      cancel = sinon.spy();
      const spies: any =  { handleSubmit, change, cancel };
      mountedComponent = mountWithTheme(reduxWrap(
        <MachineFormConnected
          {...props}
          {...spies}
        />,
      ));
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.admin__form-container')).to.have.length(1);
    });
  });
});
