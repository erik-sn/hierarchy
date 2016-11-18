import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS, List } from 'immutable';

import Admin from '../../../src/components/admin/admin';
import { sites } from '../../../__test__/sample';

describe('admin.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  describe('Default | >>>', () => {
    let component;
    const props = {
      hierarchy,
      params: {
        menu: 'hierarchy',
      },
    };

    beforeEach(() => {
      component = shallow(<Admin {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.exist();
      expect(component.find('.admin__container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('Card')).to.have.length(1);
      expect(component.find('CardHeader')).to.have.length(1);
      expect(component.find('AdminTabs')).to.have.length(1);
      expect(component.find('AdminHierarchy')).to.have.length(1);
    });

    it('3. shows the specification config if specifications are selected', () => {
      const newProps = {
        params: {
          menu: 'specifications',
        },
      };
      component = shallow(<Admin {...newProps} />);
      expect(component.find('.admin__specifications')).to.have.length(1);
    });

    it('4. shows the permissions config if specifications are selected', () => {
      const newProps = {
        params: {
          menu: 'permissions',
        },
      };
      component = shallow(<Admin {...newProps} />);
      expect(component.find('.admin__permissions')).to.have.length(1);
    });

    it('4. renderes hierarchy if no menu in props', () => {
      const newProps = {
        params: {
        },
      };
      component = shallow(<Admin {...newProps} />);
      expect(component.find('AdminHierarchy')).to.have.length(1);
    });

    it('5. shouldComponentUpdate', () => {
      const nextPropsDiffHierarchy = {
        hierarchy: List([]),
        params: {
          menu: 'test',
        },
      };
      const nextPropsDiffMenu = {
        hierarchy,
        params: {
          menu: 'test',
        },
      };
      const nextPropsDiffSplat = {
        hierarchy,
        params: {
          menu: 'hierarchy',
          splat: 'newplat',
        },
      };
      const nextState1 = { activeMenu: undefined };
      const ist = component.instance();
      expect(ist.shouldComponentUpdate(nextPropsDiffHierarchy, component.state())).to.equal(true);
      expect(ist.shouldComponentUpdate(nextPropsDiffMenu, component.state())).to.equal(true);
      expect(ist.shouldComponentUpdate(nextPropsDiffSplat, component.state())).to.equal(true);
      expect(ist.shouldComponentUpdate(props, nextState1)).to.equal(true);
      expect(ist.shouldComponentUpdate(props, component.state())).to.equal(false);
    });
  });
});
