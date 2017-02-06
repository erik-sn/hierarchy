import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import MachineContainer from '../../../../src/components/hierarchy/main/machine_container';
import MainDepartment,
{ IMainDepartmentProps } from '../../../../src/components/hierarchy/main/main_department';
import { IDepartment, ISite } from '../../../../src/constants/interfaces';

const siteList: ISite[] = require('../../../sites.json');


describe('main_department.test.tsx |', () => {
  const site: ISite = siteList[0];
  const department: IDepartment = site.departments[0];

  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IMainDepartmentProps = { site, department };

    beforeEach(() => {
      component = shallow(<MainDepartment {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('Card')).to.have.length(1);
      expect(component.find('CardHeader')).to.have.length(1);
      expect(component.find('CardText')).to.have.length(1);
      expect(component.find(MachineContainer)).to.have.length(1);
    });
  });
});
