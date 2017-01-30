import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { reduxWrap } from '../helper';
import NotfoundContainer, { NotFound } from '../../src/components/notfound';

describe('notfound.test.js |', () => {
  describe('Expected | >>>', () => {
    let component;
    const props = {
    };

    beforeEach(() => {
      component = shallow(<NotFound {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.exist();
      expect(component.find('.notfound__container')).to.have.length(1);
    });
  });

});
