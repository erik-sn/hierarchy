import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import ExtrusionPackAnalysis from './extrusion_pack_analysis';

describe('extrusion_pack_analysis.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      item: Map({ name: 'test_parent' }),
    };

    beforeEach(() => {
      component = shallow(<ExtrusionPackAnalysis {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.extrusion_pack_analysis__container')).to.have.length(1);
      expect(component.find('h3').text()).to.equal('Hello extrusion_pack_analysis');
    });
  });
});
