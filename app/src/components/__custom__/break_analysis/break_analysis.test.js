import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import BreakAnalysis from './break_analysis';

describe('break_analysis.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      parent: Map({ name: 'test_parent' }),
    };

    beforeEach(() => {
      component = shallow(<BreakAnalysis {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.break_analysis__container')).to.have.length(1);
    });
  });
});
