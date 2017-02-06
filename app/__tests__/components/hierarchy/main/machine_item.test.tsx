import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import MachineItem, { IMachineItemProps } from '../../../../src/components/hierarchy/main/machine_item';


describe('machine_item.test.tsx |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IMachineItemProps = {
      name: 'test machine',
      url: '/destination',
    };

    beforeEach(() => {
      component = shallow(<MachineItem {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('Link')).to.have.length(1);
      expect(component.find('Link').props().to).to.equal(`${props.url}/${props.name}`);
      expect(component.find('.main__machine-item-label').text()).to.equal('test machine');
    });
  });
});
