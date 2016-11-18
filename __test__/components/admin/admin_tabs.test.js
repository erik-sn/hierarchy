import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import AdminTabs from '../../../src/components/admin/admin_tabs';

describe('admin_tabs.test.js |', () => {
  describe('Expected | >>>', () => {
    let component;
    let navigate;

    beforeEach(() => {
      navigate = sinon.spy();
      component = shallow(<AdminTabs navigate={navigate} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
    });

    it('2. has the correct elements with the correct labels', () => {
      expect(component.find('Tabs')).to.have.length(1);
      expect(component.find('Tab')).to.have.length(3);
      expect(component.find('Tab').get(0).props.label).to.equal('hierarchy');
      expect(component.find('Tab').get(1).props.label).to.equal('specifications');
      expect(component.find('Tab').get(2).props.label).to.equal('permissions');
    });

    it('3. calls navigate on click', () => {
      component.find('Tab').at(0).simulate('click');
      component.find('Tab').at(1).simulate('click');
      component.find('Tab').at(2).simulate('click');
      expect(navigate.callCount).to.equal(3);
    });
  });
});
