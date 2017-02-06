import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import Settings,
  { ISettingsProps } from '../../../src/components/navbar/navbar_settings';


describe('navbar_settings.test.tsx |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: ISettingsProps = {
      settings: 'settings',
      admin: 'admin',
      help: 'help',
      about: 'about',
    };

    beforeEach(() => {
      component = shallow(<Settings {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('IconMenu')).to.have.length(1);
      expect(component.find('Link')).to.have.length(4);
      expect(component.find('MenuItem')).to.have.length(4);
    });

    it('Links have correct "to" props', () => {
      expect(component.find('Link').at(0).props().to).to.equal(props.settings);
      expect(component.find('Link').at(1).props().to).to.equal(props.admin);
      expect(component.find('Link').at(2).props().to).to.equal(props.help);
      expect(component.find('Link').at(3).props().to).to.equal(props.about);
    });
  });
});
