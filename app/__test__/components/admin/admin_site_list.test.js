import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import sinon from 'sinon';
import moxios from 'moxios';

import AdminSiteList from '../../../src/components/admin/admin_site_list';
import { sites } from '../../../__test__/sample';

describe('admin_site_list.test.js |', () => {
  const hierarchy = fromJS(JSON.parse(sites));
  describe('Expected | >>>', () => {
    let component;
    let navigate;
    const props = {
      sites: hierarchy,
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
      expect(component.find('ListItem')).to.have.length(6);
      expect(component.find('FlatButton')).to.have.length(1);
    });

    it('3. calls navigate on click', () => {
      component.find('ListItem').first().simulate('click');
      expect(navigate.callCount).to.equal(1);
    });
  });

  describe('Functions | >>>', () => {
    let component;
    let fetchHierarchy;
    const site = hierarchy.get(3);
    const props = {
      sites: hierarchy,
      splat: '/ox/machines',
    };

    beforeEach(() => {
      moxios.install();
      fetchHierarchy = sinon.spy();
      component = shallow(<AdminSiteList {...props} fetchHierarchy={fetchHierarchy} />);
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('1. correctly sets state on succesful createSite', (done) => {
      component.setState({ showNewSiteForm: true });
      component.instance().createSite(site);
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 201,
          response: site,
        }).then(() => {
          expect(fetchHierarchy.callCount).to.equal(1);
          expect(component.state().showNewSiteForm).to.equal(false);
          expect(component.state().messageShow).to.equal(true);
          expect(component.state().messageText).to.equal('Site Successfully Created: Oak River');
          done();
        });
      });
    });

    it('2. correctly shows an error message on fail', (done) => {
      component.setState({ showNewSiteForm: true });
      component.instance().createSite(site);
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 401,
          response: site,
        }).then(() => {
          expect(fetchHierarchy.callCount).to.equal(0);
          expect(component.state().showNewSiteForm).to.equal(false);
          expect(component.state().messageShow).to.equal(true);
          expect(component.state().messageText).to.equal('Error Creating Site: Oak River');
          done();
        });
      });
    });
  });
});
