
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { IBaseModule } from '../../../../src/constants/interfaces';
import SampleLineEfficiency from './sample__line_efficiency';

describe('sample__line_efficiency.tsx |', () => {
  describe('Default | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IBaseModule = {
      parent: {
        name: 'parent',
        modules: undefined,
        active: true,
        apiCalls: [],
        machines: [],
        site: undefined,
      },
      module: undefined,
      type: 'department',
      departmentDataStore: undefined,
    };

    beforeEach(() => {
      component = shallow(<SampleLineEfficiency {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.sample__line_efficiency__container')).to.have.length(1);
    });
  });
});
