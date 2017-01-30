import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { fromJS, Map } from 'immutable';
import sinon from 'sinon';
import jest from 'jest';

import Navbar, { Neighbor, Settings } from '../../src/components/navbar';
import { sites } from '../../__test__/sample';
import { mountWithTheme, triggerResize } from '../../__test__/helper';
import { resolvePath } from '../../src/utils/resolver';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const data = fromJS(JSON.parse(sites));

describe('navbar.test.js |', () => {
  describe('Neighbor component | >>>', () => {
    let component;
    let hide;
    const props = {
      path: '/test/me/',
      name: 'myname',
    };

    beforeEach(() => {
      hide = sinon.spy();
      component = shallow(<Neighbor {...props} hide={hide} />);
    });

    it('mounts and has Link with correct link and calls hide on click ', () => {
      expect(component.find('Link')).to.have.length(1);
      expect(component.find('Link').props().to).to.equal(props.path + props.name);
      component.find('Link').simulate('click');
      expect(hide.callCount).to.equal(1);
    });

    it('has a MenuItem with the correct value ', () => {
      expect(component.find('MenuItem')).to.have.length(1);
      expect(component.find('MenuItem').props().value).to.equal('myname');
    });
  });

  describe('Settings component | >>>', () => {
    let component;
    const props = {
      settings: '/settings',
      admin: '/admin',
    };

    beforeEach(() => {
      component = shallow(<Settings {...props} />);
    });

    it('has the correct elements', () => {
      expect(component.find('IconMenu')).to.have.length(1);
      expect(component.find('Link')).to.have.length(2);
      expect(component.find('MenuItem')).to.have.length(2);
    });

    it('has links navigating to the correct location', () => {
      expect(component.find('Link').at(0).props().to).to.equal(props.settings);
      expect(component.find('Link').at(1).props().to).to.equal(props.admin);

    })

  });

  describe('Expected | >>>', () => {
    let component;
    const props = {
      user: Map({ username: 'test_user', ip: '0.0.0.0' }),
      config: Map({ name: 'Test Name!' }),
      hierarchy: resolvePath(data, '/ox/extrusion/ox11'),
      path: '/ox/extrusion/ox11',
    };

    beforeEach(() => {
      component = shallow(<Navbar {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.exist();
      expect(component.find('.navbar__icon-container')).to.have.length(1);
      expect(component.find('.navbar__app-label')).to.have.length(1);
      expect(component.find('.navbar__hierarchy-container')).to.have.length(1);
      expect(component.find('.navbar__info-container')).to.have.length(1);
      expect(component.find('.navbar__username')).to.have.length(1);
      expect(component.find('.navbar__settings')).to.have.length(1);
      expect(component.find('Settings')).to.have.length(1);
    });

    it('2. displays the correct user', () => {
      expect(component.find('.navbar__username').text()).to.equal('test_user');
    });

    it('3. displays the correct application name', () => {
      expect(component.find('.navbar__app-label').text()).to.equal('Test Name!');
    });

    it('4. should have three hierarchy items', () => {
      expect(component.find('.navbar__hierarchy-item-parent')).to.have.length(3);
    });

    it('5. hierarchy items should have the correct values', () => {
      const items = component.find('.navbar__hierarchy-item-child');
      expect(items.at(0).text()).to.equal('');
      expect(items.at(1).text()).to.equal('Oak River');
      expect(items.at(2).text()).to.equal('Extrusion');
      expect(items.at(3).text()).to.equal('OX11');
    });
  });

  describe('User Error | >>>', () => {
    let component;
    const props = {
      user: Map({ username: undefined, ip: undefined }),
      config: Map({ name: 'Test Name! ' }),
      error: true,
      hierarchy: resolvePath(data, '/ox/extrusion/ox11')
    };

    beforeEach(() => {
      component = shallow(<Navbar {...props} />, {});
    });

    it('1. displays unavailable if the user is undefined', () => {
      expect(component.find('.navbar__username').text()).to.equal('');
    });
  });

  describe('No Hierarchy | >>>', () => {
    let component;
    const props = {
      user: Map({ username: 'hello', ip: undefined }),
      config: Map({ name: 'Test Name! ' }),
      error: false,
      hierarchy: undefined,
      path: '/',
    };

    beforeEach(() => {
      component = shallow(<Navbar {...props} />);
    });

    it('1. shows no hierarchy items if no hierarchy is present', () => {
      expect(component.find('.navbar__hierarchy-item-parent')).to.have.length(0);
    });
  });

  describe('Should Component Update | >>>', () => {
    let component;
    const props = {
      user: Map({ username: 'hello', ip: undefined }),
      config: Map({ name: 'Test Name! ' }),
      error: false,
      hierarchy: undefined,
      path: '/',
    };

    beforeEach(() => {
      component = shallow(<Navbar {...props} />);
    });

    it('1. shows no hierarchy items if no hierarchy is present', () => {
      const ist = component.instance();
      const diffPropsPath = {
        path: '/newpath/',
      };
      const diffPropsHierarchy = {
        path: '/ox/extrusion/ox11/',
        hierarchy: resolvePath(data, '/ox/extrusion/ox11')
      };
      const diffStateDropdownValid = { dropdownContainer: 'yes' };
      expect(ist.shouldComponentUpdate(diffPropsPath, component.state())).to.equal(true);
      expect(ist.shouldComponentUpdate(diffPropsHierarchy, component.state())).to.equal(true);
      expect(ist.shouldComponentUpdate(props, diffStateDropdownValid)).to.equal(true);
      expect(ist.shouldComponentUpdate(props, component.state())).to.equal(false);
    });
  });

  describe('Event Listeners | >>>', () => {
    let component;
    const props = {
      user: Map({ username: 'test_user', ip: '0.0.0.0' }),
      config: Map({ name: 'Test Name!' }),
      hierarchy: resolvePath(data, '/ox/extrusion/ox11'),
      path: '/ox/extrusion',
    };

    it('1. hides neighbors on screen resize', () => {
      component = mount((
        <MuiThemeProvider>
          <Navbar {...props} />
        </MuiThemeProvider>
      ), window);
      const parent = component.find('.navbar__hierarchy-item-parent').at(2);
      parent.simulate('click');
      expect(component.find('MenuItem')).to.have.length(17);
      triggerResize();
      expect(component.find('MenuItem')).to.have.length(0);
    });


    it('2. calls componentWillUnmount', () => {
      component = shallow(<Navbar {...props} />);
      // test to make sure this executes correctly
      component.instance().componentWillUnmount();
    });

    it('3. hides neighbors if they are already showing', () => {
      component = shallow(<Navbar {...props} />);
      const dropdownContainer = <div className="navbar__neighbor-container" />;
      component.setState({ dropdownContainer });
      expect(component.find('.navbar__neighbor-container')).to.have.length(1);
      const parent = component.find('.navbar__hierarchy-item-parent').at(2);
      parent.simulate('click');
      expect(component.find('.navbar__neighbor-container')).to.have.length(0);
    });

    it('4. does not render neighbors if there are none', () => {
      component = shallow(
        <Navbar
          {...props}
          hierarchy={resolvePath(data, '/mf')}
        />
      );
      expect(component.find('.navbar__neighbor-container')).to.have.length(0);
      const parent = component.find('.navbar__hierarchy-item-parent');
      parent.simulate('click');
      expect(component.find('.navbar__neighbor-container')).to.have.length(0);
    });
  });
});
