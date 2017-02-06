import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import DepartmentTitle,
{ IDepartmentTitleProps } from '../../../../src/components/hierarchy/main/main_department_title';
import { ISite } from '../../../../src/constants/interfaces';


describe('main_department_title.test.tsx |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IDepartmentTitleProps = {
      name: 'extrusion',
      url: '/atl/extrusion',
    };

    beforeEach(() => {
      component = shallow(<DepartmentTitle {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('Link')).to.have.length(1);
      expect(component.find('.main__department-title')).to.have.length(1);
      expect(component.find('HardwareKeyboardArrowRight')).to.have.length(1);
      expect(component.find('.main__department-title-label').text()).to.equal('extrusion');
    });
  });
});
