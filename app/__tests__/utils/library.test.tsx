import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { IDictionary } from '../../src/constants/interfaces';
import { commafy, getComponent, isMomentParameter,
  isNumberParameter } from '../../src/utils/library';


describe('library.test.tsx >>>', () => {

  describe('getComponent >>>', () => {

    it('returns the correct component with the correct props', () => {
      const component: JSX.Element = getComponent('helloworld', { parent: { name: 'test' }}, '__test__');
      const wrapper = shallow(component);
      expect(wrapper.find('.helloworld__parent').text()).to.equal('Parent: test');
    });

    it('returns an invalid error if component was not found', () => {
      const component: JSX.Element = getComponent('wrong', { parent: { name: 'test' }}, '__test__');
      const wrapper = shallow(component);
      expect(wrapper.find('h3').length).to.equal(1);
      expect(wrapper.find('h3').text()).to.equal('There was an error loading this module');
    });

    it('returns an invalid error if component was not found - default __modules__ directory', () => {
      const component: JSX.Element = getComponent('wrong', { parent: { name: 'test' }});
      const wrapper = shallow(component);
      expect(wrapper.find('h3').length).to.equal(1);
      expect(wrapper.find('h3').text()).to.equal('There was an error loading this module');
    });

  });

  const isTestData: Array<IDictionary<any>> = [
    {date: '01/16/17', value: 1},
    {date: '01/17/17', value: 2},
    {date: '01/18/17', value: 3},
    {date: '01/19/17', value: 4},
    {date: '01/20/17', value: 5},
  ];
  describe('isMomentParameter >>>', () => {
    it('returns true for a list with valid dates', () => {
      expect(isMomentParameter(isTestData, 'date')).to.be.true;
    });
  });

  describe('isNumberParameter >>>', () => {
    it('returns true for a list with valid dates', () => {
      expect(isNumberParameter(isTestData, 'value')).to.be.true;
    });

    it('returns fals for a list with invalid dates', () => {
      expect(isNumberParameter(isTestData, 'date')).to.be.false;
    });
  });

  describe('commafy >>>', () => {
    it('returns commafied string with decimal place', () => {
      const withDecimal: string = '1000000.01';
      expect(commafy(withDecimal)).to.equal('1,000,000.01');
    });

    it('returns commafied string with decimal place given minLength', () => {
      const withDecimal: string = '10000.01';
      expect(commafy(withDecimal, 7)).to.equal('10000.01');
    });

    it('returns input string if length less than default', () => {
      const tooShort: string = '100.01';
      expect(commafy(tooShort)).to.equal(tooShort);
    });
  });
});

