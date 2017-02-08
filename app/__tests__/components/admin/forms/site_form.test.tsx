import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as router from 'react-router';
import * as sinon from 'sinon';

import { mountWithTheme, reduxWrap } from '../../../../__tests__/helper';
import SiteFormConnected, { ISiteFormProps, SiteForm } from '../../../../src/components/admin/forms/site_form';
import { IModule, ISite } from '../../../../src/constants/interfaces';

const siteList: ISite[] = require('../../../sites.json');

const modules: IModule[] = [
  { name: 'module1', id: 1, label: 'module1', description: 'first', active: true },
  { name: 'module2', id: 2, label: 'module2', description: 'second', active: false },
  { name: 'module3', id: 3, label: 'module3', description: 'third', active: true },
];

describe('site_form.test.tsx |', () => {
  let component: ShallowWrapper<{}, {}>;
  let change: sinon.SinonSpy;
  let handleSubmit: sinon.SinonSpy;
  describe('Expected | >>>', () => {
    const props: ISiteFormProps = {
      site: siteList[0],
      modules,
      submitForm: (form) => undefined,
      change: undefined,
      handleSubmit: undefined,
    };

    beforeEach(() => {
      change = sinon.spy();
      handleSubmit = sinon.spy();
      component = shallow(
        <SiteForm
          {...props}
          change={change}
          handleSubmit={handleSubmit}
        />,
      );
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__form-container')).to.have.length(1);
    });

    it('has the correct elements', () => {
      expect(component.find('Field')).to.have.length(9);
      expect(component.find('ModuleEdit')).to.have.length(1);
      expect(component.find('h3')).to.have.length(2);
      expect(component.find('h3').get(0).props.children).to.equal('General');
      expect(component.find('h3').get(1).props.children).to.equal('Location');
    });

    it('clearForm calls change on all fields', () => {
      const instance: any = component.instance();
      instance.clearForm();
      expect(change.callCount).to.equal(8);
    });

    it('navigateHome calls browserHistory.push', () => {
      const sandbox = sinon.sandbox.create();
      const push = sinon.spy();
      sandbox.stub(router.browserHistory, 'push', push);
      const instance: any = component.instance();
      instance.navigateHome();
      expect(push.callCount).to.equal(1);
      sandbox.restore();
    });
  });

  describe('Inside Modal | >>>', () => {
    const props: ISiteFormProps = {
      site: undefined,
      modules,
      submitForm: (form) => undefined,
      change: undefined,
      handleSubmit: undefined,
    };

    beforeEach(() => {
      change = sinon.spy();
      handleSubmit = sinon.spy();
      component = shallow(
        <SiteForm
          {...props}
          change={change}
          handleSubmit={handleSubmit}
        />,
      );
    });

    it('does not have a ModuleEdit while in a modal', () => {
      expect(component.find('ModuleEdit')).to.have.length(0);
    });
  });

  describe('Connected to redux and redux-form | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    const site: ISite = siteList[0];
    const props: ISiteFormProps = {
      site: undefined,
      modules,
      submitForm: (form) => undefined,
      change: undefined,
      handleSubmit: undefined,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      mountedComponent = mountWithTheme(reduxWrap(
        <SiteFormConnected
          {...props}
          handleSubmit={handleSubmit}
          modules={modules}
        />,
      ));
    });

    it('renders something & has correct containers', () => {
      expect(mountedComponent).to.have.length(1);
      expect(mountedComponent.find('Connect(ReduxForm)')).to.have.length(1);
    });
  });

  describe('Connected to redux and redux-form  - with site| >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    const site: ISite = siteList[0];
    const props: ISiteFormProps = {
      site: siteList[0],
      modules,
      submitForm: (form) => undefined,
      change: undefined,
      handleSubmit: undefined,
    };

    beforeEach(() => {
      handleSubmit = sinon.spy();
      mountedComponent = mountWithTheme(reduxWrap(
        <SiteFormConnected
          {...props}
          handleSubmit={handleSubmit}
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
