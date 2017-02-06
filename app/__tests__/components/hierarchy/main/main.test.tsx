import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import Main, { IMainProps } from '../../../../src/components/hierarchy/main/main';
import Department from '../../../../src/components/hierarchy/main/main_department';
import Site from '../../../../src/components/hierarchy/main/main_site';
import NotFound from '../../../../src/components/notfound';
import { ISite } from '../../../../src/constants/interfaces';
import { resolvePath } from '../../../../src/utils/resolver';

const siteList: ISite[] = require('../../../sites.json');


describe('main.test.tsx |', () => {
  const site: ISite = siteList[0];

  describe('Display Departments | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IMainProps = {
      hierarchy: resolvePath(siteList, '/atl'),
      sites: siteList,
    };

    beforeEach(() => {
      component = shallow(<Main {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.main__container')).to.have.length(1);
      expect(component.find('.main__departments')).to.have.length(1);
      expect(component.find(Department)).to.have.length(2);
    });
  });

  describe('Show site list | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IMainProps = {
      hierarchy: resolvePath(siteList, ''),
      sites: siteList,
    };

    beforeEach(() => {
      component = shallow(<Main {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.main__container')).to.have.length(1);
      expect(component.find('.main__sites')).to.have.length(1);
      expect(component.find(Site)).to.have.length(3);
    });
  });

  describe('No Sites | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IMainProps = {
      hierarchy: resolvePath(siteList, ''),
      sites: [],
    };

    beforeEach(() => {
      component = shallow(<Main {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.main__message')).to.have.length(1);
      expect(component.find('h3')).to.have.length(1);
    });
  });

  describe('Hierarchy not defined | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IMainProps = {
      hierarchy: undefined,
      sites: [],
    };

    beforeEach(() => {
      component = shallow(<Main {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find(NotFound)).to.have.length(1);
    });
  });
});
