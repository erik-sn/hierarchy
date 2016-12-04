import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import QualityAnalysis from './quality_analysis';

describe('quality_analysis.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      parent: Map({ name: 'test_parent' }),
    };

    beforeEach(() => {
      component = shallow(<QualityAnalysis {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.quality_analysis__container')).to.have.length(1);
    });
  });
});
