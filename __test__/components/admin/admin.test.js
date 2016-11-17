import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Admin from '../../../src/components/admin/admin';

describe('admin.test.js |', () => {
  describe('Expected | >>>', () => {
    let component;
    const props = {
      params: {
        menu: 'test',
      },
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
