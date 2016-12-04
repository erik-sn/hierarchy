import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import Processlog from './processlog';

describe('processlog.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      parent: Map({ name: 'test_parent' }),
    };

    beforeEach(() => {
      component = shallow(<Processlog {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.processlog__container')).to.have.length(1);
    });
  });
});
