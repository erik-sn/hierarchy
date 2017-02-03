import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import AdminTabs, { IAdminTabsProps } from '../../../src/components/admin/admin_tabs';

describe('admin_tabs.test.tsx |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let navigate: sinon.SinonSpy;
    const props: IAdminTabsProps = {
      value: 'hierarchy',
      navigate: undefined,
    };

    beforeEach(() => {
      navigate = sinon.spy();
      component = shallow(<AdminTabs {...props} navigate={navigate} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.have.length(1);
    });

    it('has the correct elements with the correct labels', () => {
      expect(component.find('Tabs')).to.have.length(1);
      expect(component.find('Tab')).to.have.length(3);
      expect(component.find('Tab').get(0).props.label).to.equal('hierarchy');
      expect(component.find('Tab').get(1).props.label).to.equal('modules');
      expect(component.find('Tab').get(2).props.label).to.equal('api calls');
    });

    it('calls navigate on click', () => {
      component.find('Tab').at(0).simulate('click');
      component.find('Tab').at(1).simulate('click');
      component.find('Tab').at(2).simulate('click');
      expect(navigate.callCount).to.equal(3);
    });
  });
});
