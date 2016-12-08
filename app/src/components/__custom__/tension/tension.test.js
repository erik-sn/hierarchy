import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import Tension from './tension';

describe('tension.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      parent: Map({ name: 'test_parent' }),
    };

    beforeEach(() => {
      component = shallow(<Tension {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.tension__container')).to.have.length(1);
    });
  });
});
