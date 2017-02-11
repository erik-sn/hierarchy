import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import { mountWithTheme } from '../../../../__tests__/helper';
import ApiEdit, { IApiEditProps } from '../../../../src/components/admin/forms/api_edit';
import { IApiCall, ISite } from '../../../../src/constants/interfaces';

const siteList: ISite[] = require('../../../sites.json');

const apiCalls: IApiCall[] = [
  {
    id: 1,
    key: 'one',
    url: '/api/one',
    description: 'one desc',
    active: true,
  },
  {
    id: 2,
    key: 'two',
    url: '/api/two',
    description: 'two desc',
    active: true,
  },
  {
    id: 3,
    key: 'three',
    url: '/api/three',
    description: 'three desc',
    active: true,
  },
  {
    id: 4,
    key: 'four',
    url: '/api/four',
    description: 'four desc',
    active: false,
  },
];

describe('api_edit.test.tsx |', () => {
  let component: ShallowWrapper<{}, {}>;
  let change: sinon.SinonSpy;

  describe('Default | >>>', () => {
    const props: IApiEditProps = {
      department: siteList[0].departments[0],
      apiCalls,
      change: undefined,
    };

    beforeEach(() => {
      change = sinon.spy();
      component = shallow(
        <ApiEdit
          {...props}
          change={change}
        />,
      );
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__apicall-edit')).to.have.length(1);
    });

    it('has the correct elements', () => {
      expect(component.find('h3')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('API Calls');
      expect(component.find('List').children()).to.have.length(3);
      expect(component.find('SelectField').children()).to.have.length(4);
    });

    it('deletes apiCall when a list item is close icon is clicked', () => {
      expect(component.find('List').find('MenuItem')).to.have.length(3);
      const menuItemProps: any = component.find('List').find('MenuItem').at(0).props();
      const closeIcon = shallow(menuItemProps.rightIcon);
      closeIcon.simulate('click');
      expect(component.find('List').find('MenuItem')).to.have.length(2);
    });

    it('creates apiCall when a select field menu item is clicked', () => {
      expect(component.find('List').find('MenuItem')).to.have.length(3);
      component.find('SelectField').find('MenuItem').at(0).simulate('click');
      expect(component.find('List').find('MenuItem')).to.have.length(3);
    });
  });

  describe('No modules present | >>>', () => {
    const props: IApiEditProps = {
      department: siteList[0].departments[0],
      apiCalls: [],
      change: undefined,
    };

    beforeEach(() => {
      change = sinon.spy();
      component = shallow(
        <ApiEdit
          {...props}
          change={change}
        />,
      );
    });

    it('renders something & has correct containers', () => {
      expect(component.find('SelectField').children()).to.have.length(0);
    });
  });
});
