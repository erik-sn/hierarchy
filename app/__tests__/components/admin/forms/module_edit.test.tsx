import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import { mountWithTheme } from '../../../../__tests__/helper';
import ModuleEdit, { IModuleEditProps } from '../../../../src/components/admin/forms/module_edit';
import { IModule, ISite } from '../../../../src/constants/interfaces';

const siteList: ISite[] = require('../../../sites.json');

const modules: IModule[] = [
  { name: 'module1', id: 1, label: 'module1', description: 'first', active: true },
  { name: 'module2', id: 2, label: 'module2', description: 'second', active: false },
  { name: 'module3', id: 3, label: 'module3', description: 'third', active: true },
];

describe('module_edit.test.tsx |', () => {
  let component: ShallowWrapper<{}, {}>;
  let change: sinon.SinonSpy;
  let sandbox: any;

  describe('Default | >>>', () => {
    const props: IModuleEditProps = {
      parentObject: siteList[0].departments[0],
      modules,
      change: undefined,
    };

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      change = sinon.spy();
      component = shallow(
        <ModuleEdit
          {...props}
          change={change}
        />,
      );
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__module-edit')).to.have.length(1);
    });

    it('has the correct elements', () => {
      expect(component.find('h3')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('Modules');
      expect(component.find('List').children()).to.have.length(3);
      expect(component.find('SelectField').children()).to.have.length(3);
    });

    it('calls updateDefaultModule on body click', () => {
      sandbox.stub(component.instance(), 'updateDefaultModule', (): any => undefined);
      component.find('List').find('MenuItem').at(0).simulate('touchTap');
      const instance: any = component.instance();
      expect(instance.updateDefaultModule.callCount).to.equal(1);
    });

    it('calls delete module when a list item is close icon is clicked', () => {
      expect(component.find('List').find('MenuItem')).to.have.length(3);
      let menuItemProps: any = component.find('List').find('MenuItem').at(0).props();
      let closeIcon = shallow(menuItemProps.rightIcon);
      closeIcon.simulate('click');
      expect(component.find('List').find('MenuItem')).to.have.length(2);

      menuItemProps = component.find('List').find('MenuItem').at(0).props();
      closeIcon = shallow(menuItemProps.rightIcon);
      closeIcon.simulate('click');
      expect(component.find('List').find('MenuItem')).to.have.length(1);

      menuItemProps = component.find('List').find('MenuItem').at(0).props();
      closeIcon = shallow(menuItemProps.rightIcon);
      closeIcon.simulate('click');
      expect(component.find('List').find('MenuItem')).to.have.length(0);
    });

    it('calls add module when a select field menu item is clicked', () => {
      expect(component.find('List').find('MenuItem')).to.have.length(3);
      component.find('SelectField').find('MenuItem').at(0).simulate('click');
      expect(component.find('List').find('MenuItem')).to.have.length(4);
    });
  });

  describe('No modules present | >>>', () => {
    const props: IModuleEditProps = {
      parentObject: siteList[0].departments[1],
      modules: [],
      change: undefined,
    };

    beforeEach(() => {
      change = sinon.spy();
      component = shallow(
        <ModuleEdit
          {...props}
          change={change}
        />,
      );
    });

    it('renders something & has correct containers', () => {
      expect(component.find('SelectField').children()).to.have.length(0);
    });
  });

  describe('Department with no modules | >>>', () => {
    const props: IModuleEditProps = {
      parentObject: siteList[0].departments[1],
      modules,
      change: undefined,
    };

    beforeEach(() => {
      change = sinon.spy();
      component = shallow(
        <ModuleEdit
          {...props}
          change={change}
        />,
      );
    });

    it('adding a module when none exist sets the added module as default', () => {
      expect(component.find('List').find('MenuItem')).to.have.length(0);
      component.find('SelectField').find('MenuItem').at(0).simulate('click');
      expect(component.find('List').find('MenuItem')).to.have.length(1);
    });
  });

  describe('Modules undefined | >>>', () => {
    const props: IModuleEditProps = {
      parentObject: siteList[0].departments[0],
      modules: undefined,
      change: undefined,
    };

    beforeEach(() => {
      change = sinon.spy();
      component = shallow(
        <ModuleEdit
          {...props}
          change={change}
        />,
      );
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('SelectField').children()).to.have.length(0);
    });
  });
});
