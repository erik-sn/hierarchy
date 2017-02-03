import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as moxios from 'moxios';
import * as React from 'react';
import * as sinon from 'sinon';

import AdminSiteList, { IAdminSiteListProps } from '../../../src/components/admin/admin_site_list';
import { IDepartment, ISite } from '../../../src/constants/interfaces';

const siteList: ISite[] = require('../../sites.json');

describe('admin_site_list.test.js |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let navigate: sinon.SinonSpy;
    const props: IAdminSiteListProps = {
      sites: siteList,
      fetchHierarchy: undefined,
      navigate: undefined,
    };

    beforeEach(() => {
      navigate = sinon.spy();
      component = shallow(<AdminSiteList {...props} navigate={navigate} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.have.length(1);
      expect(component.find('.admin__site-list-container')).to.have.length(1);
    });

    it('2. has the correct elements', () => {
      expect(component.find('List')).to.have.length(1);
      expect(component.find('ListItem')).to.have.length(3);
      expect(component.find('FlatButton')).to.have.length(1);
    });

    it('3. calls navigate on click', () => {
      component.find('ListItem').first().simulate('click');
      expect(navigate.callCount).to.equal(1);
    });
  });

  describe('Functions | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    let fetchHierarchy: sinon.SinonSpy;
    const site = siteList[0];
    const props: IAdminSiteListProps = {
      sites: siteList,
      navigate: undefined,
      fetchHierarchy: undefined,
    };

    beforeEach(() => {
      moxios.install();
      fetchHierarchy = sinon.spy();
      component = shallow(<AdminSiteList {...props} fetchHierarchy={fetchHierarchy} />);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('correctly sets state on succesful createSite', (done) => {
      component.setState({ showNewForm: true });
      const instance: any = component.instance();
      instance.createSite(site);
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 201,
          response: site,
        }).then(() => {
          const state: any = component.state();
          expect(fetchHierarchy.callCount).to.equal(1);
          expect(state.showNewForm).to.equal(false);
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('Site Successfully Created: Atlanta');
          done();
        });
      });
    });

    it('correctly shows an error message on fail', (done) => {
      component.setState({ showNewForm: true });
      const instance: any = component.instance();
      instance.createSite(site);
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 401,
          response: site,
        }).then(() => {
          const state: any = component.state();
          expect(fetchHierarchy.callCount).to.equal(0);
          expect(state.showNewForm).to.equal(false);
          expect(state.messageShow).to.equal(true);
          expect(state.messageText).to.equal('Error Creating Site: Atlanta');
          done();
        });
      });
    });
  });
});
