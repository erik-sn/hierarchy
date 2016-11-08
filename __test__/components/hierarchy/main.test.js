import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map, List, fromJS } from 'immutable';
import sinon from 'sinon';

import { mountWithTheme } from '../../helper';
import { Main, Site, Department, MachineContainer, MachineItem } from '../../../src/components/hierarchy/main';
import { sites } from '../../../__test__/sample';
import { resolvePath } from '../../../src/utils/resolver';

const data = fromJS(JSON.parse(sites));

describe('main.test.js |', () => {
  let component;

  describe('Sites | >>>', () => {
    const props = {
      sites: data,
      hierarchy: resolvePath(data, '/'),
    };

    beforeEach(() => {
      component = shallow(<Main {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('.main__container')).to.have.length(1);
    });

    it('2. renders three sites', () => {
      expect(component.find('Site')).to.have.length(6);
    });


    it('3. calls show map when place is clicked', () => {
      let siteWithCoords = data.get(3);
      siteWithCoords = siteWithCoords.set('latitude', '10');
      siteWithCoords = siteWithCoords.set('longitude', '10');
      const newData = data.set(1, siteWithCoords);
      const showModal = sinon.spy();
      const newProps = {
        sites: newData,
        hierarchy: resolvePath(newData, '/'),
        showModal,
      };
      component = mountWithTheme(<Main {...newProps} />);
      component.find('MapsPlace').simulate('click');
      expect(showModal.callCount).to.equal(1);
    });
  });

  describe('Site Component | >>>', () => {
    const site = data.get(0);

    beforeEach(() => {
      component = shallow(<Site site={site} />);
    });

    it('1. renders with the correct container', () => {
      expect(component.find('.main__site-container')).to.have.length(1);
    });

    it('2. renders correct content information', () => {
      expect(component.find('CardTitle').props().title).to.equal('Antioch - AN');
      expect(component.find('CardTitle').props().subtitle).to.equal('Dalton, GA');
      expect(component.find('CardText').props().children[0]).to.equal('Departments: ');
      expect(component.find('CardText').props().children[1]).to.equal(0);
      expect(component.find('MapsPlace')).to.have.length(0);
    });

    it('3. shows a place if there are coordinates available', () => {
      let siteWithCoords = data.get(1);
      siteWithCoords = siteWithCoords.set('latitude', 10);
      siteWithCoords = siteWithCoords.set('longitude', 10);
      component = shallow(<Site site={siteWithCoords} />);
      expect(component.find('MapsPlace')).to.have.length(1);
    });
  });

  describe('Departments | >>>', () => {
    const props = {
      sites: data,
      hierarchy: resolvePath(data, '/ox/'),
    };

    beforeEach(() => {
      component = shallow(<Main {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('.main__container')).to.have.length(1);
    });

    it('2. renders one department', () => {
      expect(component.find('Department')).to.have.length(1);
    });
  });

  describe('Department Component | >>>', () => {

    beforeEach(() => {
      const site = data.get(3);
      const department = site.get('departments').get(0);
      component = shallow(<Department site={site} dpt={department} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('.main__department-container')).to.have.length(1);
    });

    it('2. renders correct content information', () => {
      expect(component.find('CardTitle').props().title).to.equal('Extrusion');
      expect(component.find('MachineContainer')).to.have.length(1);
    });
  });

  describe('Machine Container | >>>', () => {
    const props = {
      url: '/ox/extrusion',
      dpt: resolvePath(data, '/ox/extrusion').get('department'),
    };

    beforeEach(() => {
      component = shallow(<MachineContainer {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('.main__site-machinecount')).to.have.length(1);
    });

    it('2. has the correct amount of MachineItems', () => {
      expect(component.find('MachineItem')).to.have.length(17);
    });
  });

  describe('Machine Item | >>>', () => {
    const props = {
      url: '/ox/extrusion',
      name: 'test',
    };

    beforeEach(() => {
      component = shallow(<MachineItem {...props} />);
    });

    it('1. renders something & has correct containers', () => {
      expect(component.find('.main__machine-item')).to.have.length(1);
    });

    it('2. has the correct label', () => {
      expect(component.find('Chip').children().text()).to.equal('test');
    });

    it('3. has a link to the correct url', () => {
      expect(component.find('Link').prop('to')).to.equal('/ox/extrusion/test');
    });
  });
});
