import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import Yap100 from './yap100';

describe('yap100.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      parent: Map({ name: 'test_parent' }),
    };

    beforeEach(() => {
      component = shallow(<Yap100 {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.yap100__container')).to.have.length(1);
    });
  });
});
