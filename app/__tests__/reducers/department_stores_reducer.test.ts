/* tslint:disable:no-string-literal */
import { expect } from 'chai';

import types from '../../src/actions/types';
import { IAction, IDepartmentIdMap, IHierarchy } from '../../src/constants/interfaces';
import reducer, { initialState } from '../../src/reducers/department_stores_reducer';

describe('department_stores_reducer.test.js | >>>', () => {
  const testStore: IDepartmentIdMap = {
    error: false,
    1: {
      list1: ['a', 'b', 'c', 'd'],
      list2: [1, 2, 3, 4, 5, 6, 7],
    },
    2: {
      list1: ['l', 'm', 'n', 'o', 'p'],
      list2: [100, 99, 98, 97, 96, 95, 94],
    },
  };

  it('1. should return the initial state', () => {
    expect(reducer(initialState, { payload: {}, type: 'test' })).to.deep.equal(initialState);
  });

  it('2. adds a new department key if it does not exist', () => {
    const newList: string[] = ['q', 'r', 's'];
    const result: IDepartmentIdMap = reducer(testStore, {
      meta: {
        department: 3,
        key: 'list1',
      },
      payload: {
        data: newList,
      },
      type: types.SET_DEPARTMENT_DATA,
    });
    expect(result.error).to.equal(false);
    expect(result[1]['list1']).to.equal(testStore[1].list1);
    expect(result[1]['list2']).to.equal(testStore[1].list2);
    expect(result[2]['list1']).to.equal(testStore[2].list1);
    expect(result[2]['list2']).to.equal(testStore[2].list2);
    expect(result[3]['list1']).to.equal(newList);
  });

  it('3. correctly updates the department key', () => {
    const newList: string[] = ['q', 'r', 's'];
    const result: IDepartmentIdMap = reducer(testStore, {
      meta: {
        department: 1,
        key: 'list1',
      },
      payload: {
        data: newList,
      },
      type: types.SET_DEPARTMENT_DATA,
    });
    expect(result.error).to.equal(false);
    expect(result[1]['list1']).to.equal(newList);
    expect(result[1]['list2']).to.equal(testStore[1].list2);
    expect(result[2]['list1']).to.equal(testStore[2].list1);
    expect(result[2]['list2']).to.equal(testStore[2].list2);
  });
});

