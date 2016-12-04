import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import ExtrusionWasteAnalysis from './extrusion_waste_analysis';

describe('extrusion_waste_analysis.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      parent: Map({ name: 'test_parent' }),
    };

    beforeEach(() => {
      component = shallow(<ExtrusionWasteAnalysis {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.extrusion_waste_analysis__container')).to.have.length(1);
    });
  });
});
