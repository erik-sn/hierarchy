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
      expect(component.find('MenuItem')).to.have.length(4);
    });

    it('Menu Items have correct labels', () => {
      const menuOneProps: any = component.find('MenuItem').at(0).props();
      const menuTwoProps: any = component.find('MenuItem').at(1).props();
      const menuThreeProps: any = component.find('MenuItem').at(2).props();
      const menuFourProps: any = component.find('MenuItem').at(3).props();

      expect(menuOneProps.primaryText.toLowerCase()).to.equal(props.settings);
      expect(menuTwoProps.primaryText.toLowerCase()).to.equal(props.admin);
      expect(menuThreeProps.primaryText.toLowerCase()).to.equal(props.help);
      expect(menuFourProps.primaryText.toLowerCase()).to.equal(props.about);
    });
  });
});
