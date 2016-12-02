import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import Department from '../../../src/components/hierarchy/department';import { sites } from '../../../__test__/sample';
import { resolvePath } from '../../../src/utils/resolver';

const data = fromJS(JSON.parse(sites));

describe('about.test.js |', () => {
  describe('Expected | >>>', () => {
    let component;
    const props = {
      hierarchy: resolvePath(data, '/ox/extrusion'),
    };

    beforeEach(() => {
      component = shallow(<Department {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('.department__container')).to.have.length(1);
      expect(component.find('Link')).to.have.length(17);
    });
  });

});
