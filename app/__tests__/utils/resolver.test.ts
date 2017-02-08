import { expect } from 'chai';
import * as router from 'react-router';
import * as sinon from 'sinon';

import { IDepartment, IHierarchyItems, IMachine, ISite } from '../../src/constants/interfaces';
import { buildNavigate, getDepartments, getMachines,
  parseDepartment, parseMachine, parsePath, parseSite, resolvePath } from '../../src/utils/resolver';

const siteList: ISite[] = require('../sites.json');

describe('resolver.test.js |', () => {
  describe('buildNavigate | >>>', () => {
    it('throws an error if input string is empty', () => {
      expect(() => buildNavigate('')).to.throw('A base string is required');
    });

    it('calls browserhistory.push with the correct input', () => {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(router.browserHistory, 'push', (target: any) => target);
      const navigate = buildNavigate('/testMe');
      expect(navigate('tohere')).to.equal('/testme/tohere/');
      expect(navigate('tOHERE/and/there')).to.equal('/testme/tohere/and/there/');
      sandbox.restore();
    });
  });

  describe('Hierarchy Searching | >>>', () => {
    const siteID: number = 1;
    const siteCode: string = 'ATL';
    const departmentID: number = 1;
    const departmentName: string = 'Extrusion';
    const machineID: number = 13;
    const machineName: string = 'AX7';
    const badId: number = 99;
    const badCode: string = 'invalid';

    it('parseSite: returns the correct site', () => {
      expect(parseSite(siteList, siteCode).name).to.equal('Atlanta');
    });

    it('parseSite: returns undefined if site doesnt exist', () => {
      expect(parseSite(siteList, badCode)).to.equal(undefined);
    });

    it('getDepartments: returns the correct departments', () => {
      const departments = siteList.find((site) => site.id === siteID).departments;
      expect(getDepartments(siteList, siteCode)).to.deep.equal(departments);
    });

    it('parseDepartment: returns the correct department', () => {
      const department = siteList
                          .find((site) => site.id === siteID).departments
                          .find((dpt) => dpt.id === departmentID);
      expect(parseDepartment(siteList, siteCode, departmentName)).to.deep.equal(department);
    });

    it('getMachines: returns the correct machines', () => {
      const machines = siteList
                        .find((site) => site.id === siteID).departments
                        .find((dpt) => dpt.id === departmentID).machines;
      expect(getMachines(siteList, siteCode, departmentName)).to.deep.equal(machines);
    });

    it('parseMachine: finds the correct machine', () => {
      const machine = siteList
                        .find((site) => site.id === siteID).departments
                        .find((dpt) => dpt.id === departmentID).machines
                        .find((mch) => mch.id === machineID);
      expect(parseMachine(siteList, siteCode, departmentName, machineName)).to.deep.equal(machine);
    });

    it('correctly resolves the path', () => {
      const site: ISite = siteList.find((s) => s.id === siteID);
      const department: IDepartment = site.departments.find((dpt) => dpt.id === departmentID);
      const machine: IMachine = department.machines.find((mch) => mch.id === machineID);

      const resolved: IHierarchyItems = resolvePath(siteList, '/atl/extrusion/ax7/');
      expect(resolved.site).to.deep.equal(site);
      expect(resolved.department).to.deep.equal(department);
      expect(resolved.machine).to.deep.equal(machine);
    });

    it('returns the correct url parameters', () => {
      const url1: string = '/atl/extrusion/ax7/';
      expect(parsePath(url1)).to.deep.equal(['atl', 'extrusion', 'ax7']);

      // decodes uri
      const url2: string = '/chs/heat%20set/';
      expect(parsePath(url2)).to.deep.equal(['chs', 'heat set']);
    });
  });
});
