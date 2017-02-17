import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import Module, { IModuleProps } from '../../../src/components/hierarchy/module';
import { IModule, ISite } from '../../../src/constants/interfaces';

const siteList: ISite[] = require('../../sites.json');

describe('module.test.tsx |', () => {
  describe('Module === Default Module | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let setActive: sinon.SinonSpy;
    const module: IModule = siteList[0].departments[0].defaultModule;
    const props: IModuleProps = {
      setActive: undefined,
      hierarchyObject: siteList[0].departments[0],
      module,
      activeModule: module,
    };

    beforeEach(() => {
      setActive = sinon.spy();
      component = shallow(<Module {...props} setActive={setActive} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('Link')).to.have.length(1);
      expect(component.find('.display__module-item').text()).to.contain(module.label);
    });

    it('renders the description in a tooltip', () => {
      expect(component.find('.display__module-item-tooltip')).to.have.length(1);
      expect(component.find('.display__module-item-tooltip').text()).to.equal(module.description);
    });

    it('has the host__tab-selected class if it is the active module', () => {
      expect(component.find('.host__tab-selected')).to.have.length(1);
    });

    it('has a link to the base url', () => {
      expect(component.find('Link').props().to).to.equal('blank');
    });

    it('calls setActive on click', () => {
      component.find('.display__module-item').simulate('click');
      expect(setActive.callCount).to.equal(1);
    });
  });

  describe('Module !== Default Module | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let setActive: sinon.SinonSpy;
    const props: IModuleProps = {
      setActive: undefined,
      hierarchyObject: siteList[0].departments[0],
      module: siteList[0].departments[0].modules[0],
      activeModule: siteList[0].departments[0].modules[1],
    };

    beforeEach(() => {
      setActive = sinon.spy();
      component = shallow(<Module {...props} setActive={setActive} />);
    });

    it('has the host__tab class since it is NOT active', () => {
      expect(component.find('.host__tab')).to.have.length(1);
    });

    it('has a link to the base url with module extension ', () => {
      expect(component.find('Link').props().to).to.equal('blank/m/overview');
    });
  });
});
