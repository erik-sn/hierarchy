import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import NotFound from '../../src/components/notfound';

describe('notfound.test.tsx |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;

    beforeEach(() => {
      component = shallow(<NotFound />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.notfound__container')).to.have.length(1);
    });

    it('has a link to the home page', () => {
      expect(component.find('Link')).to.have.length(1);
      expect(component.find('Link').props().to).to.equal('/');
    });
  });

});
