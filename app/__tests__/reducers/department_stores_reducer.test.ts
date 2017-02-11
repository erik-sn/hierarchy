/* tslint:disable:no-string-literal */
import { expect } from 'chai';
import { is, fromJS, List } from 'immutable';

import types from '../../src/actions/types';
import { IAction, IDepartmentIdMap, IHierarchy } from '../../src/constants/interfaces';
import reducer, { initialState } from '../../src/reducers/department_stores_reducer';

describe('department_stores_reducer.test.js | >>>', () => {
  const testStore: IDepartmentIdMap = {
    error: false,
    1: {
      list1: List(['a', 'b', 'c', 'd']),
      list2: List([1, 2, 3, 4, 5, 6, 7]),
    },
    2: {
      list1: List(['l', 'm', 'n', 'o', 'p']),
      list2: List([100, 99, 98, 97, 96, 95, 94]),
    },
  };

  it('should return the initial state', () => {
    expect(reducer(initialState, { payload: {}, type: 'test' })).to.deep.equal(initialState);
  });

  it('adds a new department key if it does not exist', () => {
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
    console.log(result[1]['list1'])
    expect(is(result[1]['list1'], testStore[1].list1)).to.be.true;
    expect(is(result[1]['list2'], testStore[1].list2)).to.be.true;
    expect(is(result[2]['list1'], testStore[2].list1)).to.be.true;
    expect(is(result[2]['list2'], testStore[2].list2)).to.be.true;
    expect(is(result[3]['list1'], fromJS(newList))).to.be.true;
  });

  it('correctly updates the department key', () => {
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
    expect(is(result[1]['list1'], fromJS(newList))).to.be.true;
    expect(is(result[1]['list2'], testStore[1].list2)).to.be.true;
    expect(is(result[2]['list1'], testStore[2].list1)).to.be.true;
    expect(is(result[2]['list2'], testStore[2].list2)).to.be.true;
  });
});

