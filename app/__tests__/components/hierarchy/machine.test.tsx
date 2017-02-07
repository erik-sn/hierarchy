import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import { mountWithTheme, reduxWrap } from '../../../__tests__/helper';
import HelloWorld from '../../../src/components/__modules__/helloworld/helloworld';
import MachineConnected, { IMachineProps,
  Machine } from '../../../src/components/hierarchy/machine';
import Module from '../../../src/components/hierarchy/module';
import { ISite } from '../../../src/constants/interfaces';
import { resolvePath } from '../../../src/utils/resolver';

const siteList: ISite[] = require('../../sites.json');

describe('machine.test.tsx |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IMachineProps = {
      hierarchy: resolvePath(siteList, '/atl/extrusion/ax7'),
      activeModuleLabel: undefined,
      departmentDataStore: {},
    };

    beforeEach(() => {
      component = shallow(<Machine {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.display__container')).to.have.length(1);
      expect(component.find('.display__module-container')).to.have.length(1);
      expect(component.find('.display__component-container')).to.have.length(1);
      expect(component.find(HelloWorld)).to.have.length(1);
      expect(component.find(Module)).to.have.length(4);
    });

    it('updates active module if received in props - no label specified', () => {
      const nextProps: IMachineProps = {
        hierarchy: resolvePath(siteList, '/atl/extrusion/ax2'),
        activeModuleLabel: undefined,
        departmentDataStore: {},
      };
      const initialState: any = component.state();
      expect(initialState.activeModule.name).to.equal('helloworld');
      component.setProps(nextProps);

      const finalState: any = component.state();
      expect(finalState.activeModule.name).to.equal('extrusion_overview');
    });

    it('updates active module if received in props - label specified', () => {
      const nextProps: IMachineProps = {
        hierarchy: resolvePath(siteList, '/atl/extrusion/ax4'),
        activeModuleLabel: 'overview',
        departmentDataStore: {},
      };
      const initialState: any = component.state();
      expect(initialState.activeModule.name).to.equal('helloworld');
      component.setProps(nextProps);

      const finalState: any = component.state();
      expect(finalState.activeModule.name).to.equal('extrusion_overview');
    });

    it('sets the activeModule in state with setActiveModule function', () => {
      const instance: any = component.instance();
      const initialState: any = component.state();
      expect(initialState.activeModule.name).to.equal('helloworld');

      instance.setActiveModule(siteList[0].departments[0].machines[0].modules[1]);
      const finalState: any = component.state();
      expect(finalState.activeModule.name).to.equal('extruder_efficiency');
    });

    it('same machine, only update url', () => {
      const nextProps: IMachineProps = {
        hierarchy: resolvePath(siteList, '/atl/extrusion/ax7'),
        activeModuleLabel: undefined,
        departmentDataStore: {},
      };
      const initialState: any = component.state();
      component.setProps(nextProps);
      const finalState: any = component.state();
      expect(finalState.url).to.equal('blank');
    });

    it('shows a prompt if the active module was not found', () => {
      component.setState({ activeModule: undefined });
      expect(component.find('h3')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('No Modules Available');
    });
  });

  describe('Specified module label | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IMachineProps = {
      hierarchy: resolvePath(siteList, '/atl/extrusion/ax7'),
      activeModuleLabel: 'hello world',
      departmentDataStore: {},
    };

    beforeEach(() => {
      component = shallow(<Machine {...props} />);
    });

    it('shows a prompt if the active module was not found', () => {
      expect(component.find('.display__container')).to.have.length(1);
      expect(component.find('.display__module-container')).to.have.length(1);
      expect(component.find('.display__component-container')).to.have.length(1);
      expect(component.find(HelloWorld)).to.have.length(1);
      expect(component.find(Module)).to.have.length(4);
    });
  });

  describe('Connects to Redux | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    const props: IMachineProps = {
      hierarchy: resolvePath(siteList, '/atl/extrusion/ax7'),
      activeModuleLabel: undefined,
      departmentDataStore: {},
    };

    beforeEach(() => {
      mountedComponent = mountWithTheme(reduxWrap(<Machine {...props} />));
    });

    it('renders something & has correct containers', () => {
      expect(mountedComponent.find('.display__container')).to.have.length(1);
      expect(mountedComponent.find('.display__module-container')).to.have.length(1);
      expect(mountedComponent.find('.display__component-container')).to.have.length(1);
      expect(mountedComponent.find(HelloWorld)).to.have.length(1);
      expect(mountedComponent.find(Module)).to.have.length(4);
    });
  });
});
