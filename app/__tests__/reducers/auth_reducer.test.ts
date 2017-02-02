import { expect } from 'chai';

import types from '../../src/actions/types';
import { IAction, IAuth } from '../../src/constants/interfaces';
import reducer, { initialState } from '../../src/reducers/auth_reducer';

describe('auth_reducer.test.js | >>>', () => {
  const response = { data: { username: 'na\\test', ip: '0.0.0.0' } };

  it('1. should return the initial state', () => {
    expect(reducer(initialState, { payload: {}, type: 'test' })).to.deep.equal(initialState);
  });

  it('2. should return the correct value for fetching auth', () => {
    const result: IAuth = reducer(initialState, {
      payload: response,
      type: types.FETCH_AUTH,
    });
    expect(result.user.username).to.equal(response.data.username);
    expect(result.user.ip).to.equal(response.data.ip);
    expect(result.error).to.equal(false);
  });

  it('3. should have error = true if there is an error', () => {
    const result = reducer(initialState, {
      error: true,
      type: types.FETCH_AUTH,
      payload: response,
    });
    expect(result.error).to.equal(true);
  });
});
