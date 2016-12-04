import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import SetpointAnalysis from './setpoint_analysis';

describe('setpoint_analysis.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      parent: Map({ name: 'test_parent' }),
    };

    beforeEach(() => {
      component = shallow(<SetpointAnalysis {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.setpoint_analysis__container')).to.have.length(1);
    });
  });
});
