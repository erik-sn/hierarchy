
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { IBaseModule } from '../../../../src/constants/interfaces';
import SampleLineScrap from './sample__line_scrap';

describe('sample__line_scrap.tsx |', () => {
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
      component = shallow(<SampleLineScrap {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.sample__line_scrap__container')).to.have.length(1);
    });
  });
});
