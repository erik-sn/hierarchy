
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { IBaseModule, IHierarchyTier } from '../../../../src/constants/interfaces';
import SampleProduction from './sample__line_production';

describe('sample__production.tsx |', () => {
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
      component = shallow(<SampleProduction {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.sample__production__container')).to.have.length(1);
    });
  });
});
