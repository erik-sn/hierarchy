import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import { mountWithTheme, reduxWrap } from '../../../__tests__/helper';
import AdminCnnected, { Admin, IAdminProps } from '../../../src/components/admin/admin';
import AdminHierarchy from '../../../src/components/admin/admin_hierarchy';
import AdminTabs from '../../../src/components/admin/admin_tabs';
import { IDepartment, IHierarchyItems, IMachine, ISite } from '../../../src/constants/interfaces';

const siteList: ISite[] = require('../../sites.json');

describe('admin.test.tsx |', () => {
  describe('Default | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let fetchHierarchy;
    const props: IAdminProps = {
      fetchHierarchy: undefined,
      sites: siteList,
      params: {
        menu: 'hierarchy',
        splat: undefined,
      },
      user: { id: 1, username: 'test name', admin: true, ip: '127.0.0.1' },
    };

    beforeEach(() => {
      fetchHierarchy = sinon.spy();
      component = shallow(<Admin {...props}  />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.admin__container')).to.have.length(1);
    });

    it('has the correct elements', () => {
      expect(component.find('Card')).to.have.length(1);
      expect(component.find('CardHeader')).to.have.length(1);
      expect(component.find(AdminTabs)).to.have.length(1);
      expect(component.find(AdminHierarchy)).to.have.length(1);
    });

  //   it('3. shows the specification config if specifications are selected', () => {
  //     const newProps = {
  //       params: {
  //         menu: 'specifications',
  //       },
  //       hierarchy,
  //       sites: hierarchy,
  //       user: Map({ username: 'test name', admin: true }),
  //     };
  //     component = shallow(<Admin {...newProps} />);
  //     expect(component.find('.admin__specifications')).to.have.length(1);
  //   });

  //   it('4. shows the permissions config if specifications are selected', () => {
  //     const newProps = {
  //       params: {
  //         menu: 'permissions',
  //       },
  //       hierarchy,
  //       sites: hierarchy,
  //       user: Map({ username: 'test name', admin: true }),
  //     };
  //     component = shallow(<Admin {...newProps} />);
  //     expect(component.find('.admin__permissions')).to.have.length(1);
  //   });

  //   it('5. shows the modules config if modules are selected', () => {
  //     const newProps = {
  //       params: {
  //         menu: 'modules',
  //       },
  //       hierarchy,
  //       sites: hierarchy,
  //       user: Map({ username: 'test name', admin: true }),
  //     };
  //     component = shallow(<Admin {...newProps} />);
  //     expect(component.find('Connect(Modules)')).to.have.length(1);
  //   });

  //   it('6. renderes hierarchy if no menu in props', () => {
  //     const newProps = {
  //       params: {
  //       },
  //       hierarchy,
  //       sites: hierarchy,
  //       user: Map({ username: 'test name', admin: true }),
  //     };
  //     component = shallow(<Admin {...newProps} />);
  //     expect(component.find('Connect(AdminHierarchy)')).to.have.length(1);
  //   });

  //   it('7. shouldComponentUpdate', () => {
  //     const nextPropsDiffHierarchy = {
  //       hierarchy: List([]),
  //       params: {
  //         menu: 'test',
  //       },
  //     };
  //     const nextPropsDiffMenu = {
  //       hierarchy,
  //       params: {
  //         menu: 'test',
  //       },
  //     };
  //     const nextPropsDiffSplat = {
  //       hierarchy,
  //       params: {
  //         menu: 'hierarchy',
  //         splat: 'newplat',
  //       },
  //     };
  //     const nextState1 = { activeMenu: undefined };
  //     const ist = component.instance();
  //     expect(ist.shouldComponentUpdate(nextPropsDiffHierarchy, component.state())).to.equal(true);
  //     expect(ist.shouldComponentUpdate(nextPropsDiffMenu, component.state())).to.equal(true);
  //     expect(ist.shouldComponentUpdate(nextPropsDiffSplat, component.state())).to.equal(true);
  //     expect(ist.shouldComponentUpdate(props, nextState1)).to.equal(true);
  //     expect(ist.shouldComponentUpdate(props, component.state())).to.equal(false);
  //   });

  //   it('8. calls fetchHierarchy on componentDidMount', () => {
  //     component.instance().componentDidMount();
  //     expect(fetchHierarchy.callCount).to.equal(1);
  //   });
  // });

  // describe('Not Authorized | >>>', () => {
  //   let component;
  //   const props = {
  //     hierarchy,
  //     sites: hierarchy,
  //     params: {
  //       menu: 'hierarchy',
  //     },
  //     user: Map({ username: 'test name', admin: false }),
  //   };

  //   beforeEach(() => {
  //     component = shallow(<Admin {...props} />);
  //   });

  //   it('1. renders unauthorized containers', () => {
  //     expect(component).to.exist();
  //     expect(component.find('.admin__message')).to.have.length(1);
  //     expect(component.find('h3').text()).to.equal('You are not authorized to view this section');
  //   });
  // });

  // describe('Connects to Redux | >>>', () => {
  //   let component;
  //   let fetchHierarchy;
  //   const props = {
  //     hierarchy,
  //     sites: hierarchy,
  //     params: {
  //       menu: 'hierarchy',
  //     },
  //     user: Map({ username: 'test name', admin: false }),
  //   };

  //   beforeEach(() => {
  //     fetchHierarchy = sinon.spy();
  //     component = mountWithTheme(reduxWrap(<AdminConnected {...props} fetchHierarchy={fetchHierarchy} />));
  //   });

  //   it('1. renders containers', () => {
  //     expect(component).to.exist();
  //   });
  });
});
