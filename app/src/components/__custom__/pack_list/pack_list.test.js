import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import PackList from './pack_list';

describe('pack_list.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      parent: Map({ name: 'test_parent' }),
    };

    beforeEach(() => {
      component = shallow(<PackList {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.pack_list__container')).to.have.length(1);
    });
  });
});
