
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { IBaseModule } from '../../../../src/constants/interfaces';
import SampleForgeOverview from './sample__forge_overview';

describe('sample__forge_overview.tsx |', () => {
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
      component = shallow(<SampleForgeOverview {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.sample__forge_overview__container')).to.have.length(1);
    });
  });
});
