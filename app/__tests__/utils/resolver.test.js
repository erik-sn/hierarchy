import { fromJS, List } from 'immutable';
import { expect } from 'chai';
import * as router from 'react-router';
import sinon from 'sinon';

import { getSite, getDepartment, getDepartments, getMachines, lowIfStr,
  getMachine, resolvePath, buildNavigate } from '../../src/utils/resolver';
import { sites } from '../../__tests__/sample';


describe('resolver.test.js |', () => {
  describe('lowOrInt | >>>', () => {
    it('1. returns input if it is a number', () => {
      expect(lowIfStr(5)).to.equal(5);
    });

    it('2. returns lowercase string if it is a string', () => {
      expect(lowIfStr('HELLO')).to.equal('hello');
    });
  });

  describe('buildNavigate | >>>', () => {
    it('1. throws an error if input string is empty', () => {
      expect(() => buildNavigate('')).to.throw('A base string is required');
    });

    it('2. calls browserhistory.push with the correct input', () => {
      router.browserHistory = { push: () => {} };
      sinon.stub(router.browserHistory, 'push', target => target);
      const navigate = buildNavigate('/testMe');
      expect(navigate('tohere')).to.equal('/testme/tohere/');
      expect(navigate('tOHERE/and/there')).to.equal('/testme/tohere/and/there/');
    });
  });

  describe('Hierarchy Searching | >>>', () => {
    const hierarchy = fromJS(JSON.parse(sites));
    const siteID = 3;
    const siteCode = 'OX';
    const departmentID = 5;
    const departmentName = 'Extrusion';
    const machineID = 5;
    const machineName = 'OX24';
    const badId = 99;

    it('1. getSite: returns the correct site', () => {
      expect(getSite(hierarchy, siteID).equals(hierarchy.find(
        site => site.get('id') === siteID))
      ).to.equal(true);

      expect(getSite(hierarchy, siteCode, { site: 'code' }).equals(hierarchy.find(
        site => site.get('id') === siteID))
      ).to.equal(true);
    });

    it('2a. getSite: throws error if site id doesnt exist', () => {
      expect(() => getSite(hierarchy, badId)).to.throw(`Site id: ${badId} does not exist`);
    });

    it('2b. getSite: throws error if there is no site data', () => {
      expect(() => getSite(List([]), siteID)).to.throw('The hierarchy data is empty');
    });

    it('3. getDepartments: returns the correct departments', () => {
      const departments = hierarchy.find(site => site.get('id') === siteID).get('departments');
      expect(departments.equals(getDepartments(hierarchy, siteID))).to.equal(true);
      expect(departments.equals(getDepartments(hierarchy, siteCode, { site: 'code' }))).to.equal(true);
    });

    it('4. getDepartments: throws an error if the site id doesnt exist', () => {
      expect(() => getDepartments(hierarchy, badId)).to.throw(`Site id: ${badId} does not exist`);
    });

    it('5. getDepartment: returns the correct department', () => {
      const department = hierarchy
                          .find(site => site.get('id') === siteID)
                          .get('departments')
                          .find(dpt => dpt.get('id') === departmentID);
      expect(department.equals(getDepartment(hierarchy, siteID, departmentID))).to.equal(true);
      const keys = { site: 'code', department: 'name' };
      expect(
        department.equals(getDepartment(hierarchy, siteCode, departmentName, keys))
      ).to.equal(true);
    });

    it('6. getDepartment: throws an error if the site id doesnt exist', () => {
      expect(() => getDepartment(hierarchy, badId, departmentID)).to.throw('Site id: 99 does not exist');
    });

    it('7. getDepartment: throws an error if the site id doesnt exist', () => {
      expect(() => getDepartment(hierarchy, siteID, badId)).to.throw('Department id: 99 does not exist');
    });

    it('8. getMachines: returns the correct machines', () => {
      const machines = hierarchy
                        .find(site => site.get('id') === siteID)
                        .get('departments')
                        .find(dpt => dpt.get('id') === departmentID)
                        .get('machines');
      expect(machines.equals(getMachines(hierarchy, siteID, departmentID))).to.equal(true);
      const keys = { site: 'code', department: 'name' };
      expect(machines.equals(getMachines(hierarchy, siteCode, departmentName, keys))).to.equal(true);
    });

    it('9. getMachines: throws an error if the site id doesnt exist', () => {
      expect(() => getMachines(hierarchy, badId, departmentID)).to.throw('Site id: 99 does not exist');
    });

    it('10. getMachines: throws an error if the site id doesnt exist', () => {
      expect(() => getMachines(hierarchy, siteID, badId)).to.throw('Department id: 99 does not exist');
    });

    it('11. getMachine: finds the correct machine', () => {
      const machine = hierarchy
                        .find(site => site.get('id') === siteID)
                        .get('departments')
                        .find(dpt => dpt.get('id') === departmentID)
                        .get('machines')
                        .find(mch => mch.get('id') === machineID);
      expect(machine.equals(getMachine(hierarchy, siteID, departmentID, machineID))).to.equal(true);
      const keys = { site: 'code', department: 'name', machine: 'name' };
      expect(machine.equals(getMachine(hierarchy, siteCode, departmentName, machineName, keys))).to.equal(true);
    });

    it('12. getMachine: throws an error if the site id doesnt exist', () => {
      expect(() => getMachine(hierarchy, badId, departmentID, machineID)).to.throw('Site id: 99 does not exist');
    });

    it('13. getMachine: throws an error if the department id doesnt exist', () => {
      expect(() => getMachine(hierarchy, siteID, badId, machineID)).to.throw('Department id: 99 does not exist');
    });

    it('14. getMachine: throws an error if the machine id doesnt exist', () => {
      expect(() => getMachine(hierarchy, siteID, departmentID, badId)).to.throw('Machine id: 99 does not exist');
    });

    it('15. correctly resolves the path', () => {
      const site = hierarchy.find(s => s.get('id') === siteID);
      const department = site.get('departments').find(dpt => dpt.get('id') === departmentID);
      const machine = department.get('machines').find(mch => mch.get('id') === machineID);
      const resolved = resolvePath(hierarchy, '/ox/extrusion/ox24');

      expect(resolved.get('site').equals(site)).to.equal(true);
      expect(resolved.get('department').equals(department)).to.equal(true);
      expect(resolved.get('machine').equals(machine)).to.equal(true);
    });
  });
});
