import { expect } from 'chai';

import types from '../../src/actions/types';
import { IAction, IHierarchy } from '../../src/constants/interfaces';
import reducer, { initialState } from '../../src/reducers/hierarchy_reducer';

describe('hierarchy_reducer.test.js | >>>', () => {
  const response = { data: ['site1', 'site2', 'site3'] };

  it('1. should return the initial state', () => {
    expect(reducer(initialState, { payload: {}, type: 'test' })).to.deep.equal(initialState);
  });

  it('2. should return the correct value for fetching auth', () => {
    const result: IHierarchy = reducer(initialState, {
      payload: response,
      type: types.FETCH_HIERARCHY,
    });
    expect(result.sites.length).to.equal(3);
  });

  it('3. should have error = true if there is an error', () => {
    const result: IHierarchy = reducer(initialState, {
      error: true,
      payload: response,
      type: types.FETCH_HIERARCHY,
    });
    expect(result.error).to.equal(true);
  });
});

