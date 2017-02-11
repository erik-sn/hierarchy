
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { IHierarchyTier } from '../../../../src/constants/interfaces';
import Helloworld, { IHelloworldProps } from './helloworld';

describe('helloworld.tsx |', () => {
  describe('Default | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IHelloworldProps = {
      parent: {
        name: 'parent',
        modules: undefined,
        active: true,
      },
    };

    beforeEach(() => {
      component = shallow(<Helloworld {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.helloworld__container')).to.have.length(1);
    });
  });
});
