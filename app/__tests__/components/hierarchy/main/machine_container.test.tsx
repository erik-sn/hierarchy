import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import MachineContainer, { IMachineContainerProps } from '../../../../src/components/hierarchy/main/machine_container';
import MachineItem from '../../../../src/components/hierarchy/main/machine_item';
import { ISite } from '../../../../src/constants/interfaces';

const siteList: ISite[] = require('../../../sites.json');


describe('machine_item.test.tsx |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IMachineContainerProps = {
      department: siteList[0].departments[0],
      url: '/atl/extrusion',
    };

    beforeEach(() => {
      component = shallow(<MachineContainer {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('CardText')).to.have.length(1);
      expect(component.find('.main__machine-container')).to.have.length(1);
      expect(component.find(MachineItem)).to.have.length(10);
    });
  });
});
