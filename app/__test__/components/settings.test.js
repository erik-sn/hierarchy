import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Settings from '../../src/components/settings';

describe('about.test.js |', () => {
  describe('Expected | >>>', () => {
    let component;
    const props = {
    };

    beforeEach(() => {
      component = shallow(<Settings {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('.settings__container')).to.have.length(1);
    });
  });

});
