/* tslint:disable:no-string-literal */
import { expect } from 'chai';
import { fromJS, is, List, Map } from 'immutable';

import types from '../../src/actions/types';
import { IAction, IHierarchy } from '../../src/constants/interfaces';
import reducer, { initialState } from '../../src/reducers/department_stores_reducer';

describe('department_stores_reducer.test.js | >>>', () => {
  const testStore: any = fromJS({
    error: false,
    1: {
      list1: ['a', 'b', 'c', 'd'],
      list2: [1, 2, 3, 4, 5, 6, 7],
    },
    2: {
      list1: ['l', 'm', 'n', 'o', 'p'],
      list2: [100, 99, 98, 97, 96, 95, 94],
    },
  });

  it('should return the initial state', () => {
    expect(reducer(initialState, { payload: {}, type: 'test' })).to.deep.equal(initialState);
  });

  it('adds a new department key if it does not exist', () => {
    const newList: string[] = ['q', 'r', 's'];
    const result: any = reducer(testStore, {
      meta: {
        department: '3',
        key: 'list1',
      },
      payload: {
        data: newList,
      },
      type: types.SET_DEPARTMENT_DATA,
    });
    expect(result.get('error')).to.be.false;
    expect(is(result.get('1').get('list1'), testStore.get('1').get('list1'))).to.be.true;
    expect(is(result.get('1').get('list2'), testStore.get('1').get('list2'))).to.be.true;
    expect(is(result.get('2').get('list1'), testStore.get('2').get('list1'))).to.be.true;
    expect(is(result.get('2').get('list2'), testStore.get('2').get('list2'))).to.be.true;
    expect(is(result.get('3').get('list1'), fromJS(newList))).to.be.true;
  });

  it('correctly updates the department key', () => {
    const newList: string[] = ['q', 'r', 's'];
    const result: any = reducer(testStore, {
      meta: {
        department: '1',
        key: 'list2',
      },
      payload: {
        data: newList,
      },
      type: types.SET_DEPARTMENT_DATA,
    });
    expect(result.get('error')).to.be.false;
    expect(is(result.get('1').get('list2'), fromJS(newList))).to.be.true;
    // expect(is(result.get('1').get('list2'), testStore.get('1').get('list2'))).to.be.true;
    expect(is(result.get('2').get('list1'), testStore.get('2').get('list1'))).to.be.true;
    expect(is(result.get('2').get('list2'), testStore.get('2').get('list2'))).to.be.true;
  });
});

