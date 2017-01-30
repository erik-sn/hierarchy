import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { About } from '../../src/components/about';

describe('about.test.js |', () => {
  describe('Expected | >>>', () => {
    let component;
    const props = {
    };

    beforeEach(() => {
      component = shallow(<About {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('.about__container')).to.have.length(1);
    });
  });

});
