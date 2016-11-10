import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { mountWithTheme } from '../../helper';
import Admin from '../../../src/components/admin/admin';

describe('admin.test.js |', () => {
  describe('Expected | >>>', () => {
    let component;
    const props = {
    };

    beforeEach(() => {
      component = shallow(<Admin {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.exist();
      expect(component.find('.admin__container')).to.have.length(1);
    });
  });

});
