import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { generateSortModules,
  retrieveModule } from '../../../src/components/hierarchy/renderModules';
import renderModules from '../../../src/components/hierarchy/renderModules';
import { ISite } from '../../../src/constants/interfaces';

describe('renderModules.test.tsx |', () => {
  describe('generateSortModules | >>>', () => {
    it('generates a function that meets expected IO', () => {
      const siteList: ISite[] = require('../../sites.json');
      const department = siteList[0].departments[0];
      const module1 = department.defaultModule;
      const module2 = department.modules[1];
      const module3 = department.modules[2];
      const sort = generateSortModules(department);
      expect(sort(module1, module2)).to.equal(-1);
      expect(sort(module2, module1)).to.equal(1);
      expect(sort(module2, module3)).to.equal(0);
    });

    it('does not error hwen department has no default module', () => {
      const siteList: ISite[] = require('../../sites.json');
      const department = siteList[1].departments[0];
      const testModule: any = { id: 1 };
      const sort = generateSortModules(department);
      expect(sort(testModule, testModule)).to.equal(0);
    });
  });

  describe('retrieveModule | >>>', () => {
    const siteList: ISite[] = require('../../sites.json');
    it('retrieves the correct module', () => {
      const department = siteList[0].departments[0];
      const module1 = department.defaultModule;
      const module = retrieveModule(department, module1.label);
      expect(module).to.deep.equal(module1);
    });

    it('returns undefined if module does not exist', () => {
      const department = siteList[0].departments[0];
      const module1 = department.modules[2];
      const module = retrieveModule(department, 'none');
      expect(module).to.equal(undefined);
    });

    it('returns undefined if module inptu string is undefined', () => {
      const department = siteList[0].departments[0];
      const module1 = department.modules[2];
      const module = retrieveModule(department, undefined);
      expect(module).to.equal(undefined);
    });
  });

  describe('renderModules | >>>', () => {
    const siteList: ISite[] = require('../../sites.json');
    const department = siteList[0].departments[0];
    const activeModule = department.modules[2];
    const modules = renderModules(activeModule, department, undefined);

    it('renders a list of module objects', () => {
      expect(modules.length).to.equal(3);
    });
  });
});
