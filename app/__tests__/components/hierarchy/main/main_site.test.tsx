import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import MainSite,
{ IMainSiteProps } from '../../../../src/components/hierarchy/main/main_site';
import { ISite } from '../../../../src/constants/interfaces';

const siteList: ISite[] = require('../../../sites.json');


describe('main_department.test.tsx |', () => {
  const site: ISite = siteList[0];

  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IMainSiteProps = { site };

    beforeEach(() => {
      component = shallow(<MainSite {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.main__site-title').text()).to.equal('Atlanta - ATL');
      expect(component.find('.main__site-subtitle').text()).to.equal('Atlanta, GA');
      expect(component.find('.main__site-departmentcount').text()).to.equal('Departments: 2');
    });

    it('renders a Link component with the correct url', () => {
      expect(component.find('Link')).to.have.length(1);
      expect(component.find('Link').props().to).to.equal('/atl');
    });
  });
});
