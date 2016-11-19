import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Machine from '../../../src/components/hierarchy/machine';

describe('about.test.js |', () => {
  describe('Expected | >>>', () => {
    let component;
    const props = {
    };

    beforeEach(() => {
      component = shallow(<Machine {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('.machine__container')).to.have.length(1);
    });
  });

});
