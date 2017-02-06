import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import { mountWithTheme, reduxWrap } from '../../../__tests__/helper';
import HelloWorld from '../../../src/components/__modules__/helloworld/helloworld';
import DepartmentConnected, { Department,
  IDepartmentProps } from '../../../src/components/hierarchy/department';
import Module from '../../../src/components/hierarchy/module';
import NotFound from '../../../src/components/notfound';
import { ISite } from '../../../src/constants/interfaces';
import { resolvePath } from '../../../src/utils/resolver';

const siteList: ISite[] = require('../../sites.json');


const propsWithModule: IDepartmentProps = {
  fetchDepartmentData: undefined,
  hierarchy: resolvePath(siteList, '/atl/extrusion'),
  params: {
    machine: undefined,
    module: 'hello world',
  },
  departmentDataStore: {},
  notFound: false,
};

describe('department.test.tsx |', () => {
  describe('Display Department, default module | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let fetchDepartmentData: sinon.SinonSpy;
    const props: IDepartmentProps = {
      fetchDepartmentData: undefined,
      hierarchy: resolvePath(siteList, '/atl/extrusion'),
      params: {
        machine: undefined,
        module: undefined,
      },
      departmentDataStore: {},
      notFound: false,
    };

    beforeEach(() => {
      fetchDepartmentData = sinon.spy();
      component = shallow(<Department {...props} fetchDepartmentData={fetchDepartmentData} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.display__container')).to.have.length(1);
      expect(component.find('.display__module-container')).to.have.length(1);
      expect(component.find('.display__component-container')).to.have.length(1);
      expect(component.find(HelloWorld)).to.have.length(1);
      expect(component.find(Module)).to.have.length(3);
    });

    it('updates the state when a different module is received in props', () => {
      const initialState: any = component.state();
      expect(initialState.activeModule.name).to.equal('helloworld');
      component.setProps({...propsWithModule, params: { module: 'overview' }});

      const finalState: any = component.state();
      expect(finalState.activeModule.name).to.equal('extrusion_overview');
    });

    it('updates the state when a different module is received in props', () => {
      const initialState: any = component.state();
      expect(initialState.activeModule.name).to.equal('helloworld');
      component.setProps({...propsWithModule, params: { machine: 'ax7' }});
      expect(component.find('Connect(Machine)')).to.have.length(1);
    });

    it('shows a prompt if the active module was not found', () => {
      component.setState({ activeModule: undefined });
      expect(component.find('h3')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('No Modules Available');
    });
  });

  describe('Display Department, specified module | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let fetchDepartmentData: sinon.SinonSpy;

    beforeEach(() => {
      fetchDepartmentData = sinon.spy();
      component = shallow(<Department {...propsWithModule} fetchDepartmentData={fetchDepartmentData} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.display__container')).to.have.length(1);
      expect(component.find('.display__module-container')).to.have.length(1);
      expect(component.find('.display__component-container')).to.have.length(1);
      expect(component.find(HelloWorld)).to.have.length(1);
      expect(component.find(Module)).to.have.length(3);
    });
  });

  describe('Renders machine | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let fetchDepartmentData: sinon.SinonSpy;
    const props: IDepartmentProps = {
      fetchDepartmentData: undefined,
      hierarchy: resolvePath(siteList, '/atl/extrusion'),
      params: {
        machine: 'ax7',
        module: undefined,
      },
      departmentDataStore: {},
      notFound: false,
    };

    beforeEach(() => {
      fetchDepartmentData = sinon.spy();
      component = shallow(<Department {...props} fetchDepartmentData={fetchDepartmentData} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('Connect(Machine)')).to.have.length(1);
    });
  });

  describe('Not Found | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let fetchDepartmentData: sinon.SinonSpy;
    const props: IDepartmentProps = {
      fetchDepartmentData: undefined,
      hierarchy: resolvePath(siteList, '/atl/extrusion'),
      params: {
        machine: undefined,
        module: 'helloworld',
      },
      departmentDataStore: {},
      notFound: true,
    };

    beforeEach(() => {
      fetchDepartmentData = sinon.spy();
      component = shallow(<Department {...props} fetchDepartmentData={fetchDepartmentData} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find(NotFound)).to.have.length(1);
    });
  });

  describe('Mounted | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    let fetchDepartmentData: sinon.SinonSpy;
    const props: IDepartmentProps = {
      fetchDepartmentData: undefined,
      hierarchy: resolvePath(siteList, '/atl/extrusion'),
      params: {
        machine: undefined,
        module: undefined,
      },
      departmentDataStore: {},
      notFound: false,
    };

    beforeEach(() => {
      fetchDepartmentData = sinon.spy();
      mountedComponent = mountWithTheme(reduxWrap(
        <Department {...props} fetchDepartmentData={fetchDepartmentData} />,
      ));
    });

    it('renders something & has correct containers', () => {
      expect(mountedComponent.find('.display__container')).to.have.length(1);
    });

    it('calls fetchDepartment data for each api call', () => {
      expect(fetchDepartmentData.callCount).to.equal(3);
    });
  });
});
