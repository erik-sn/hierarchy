import { expect } from 'chai';

import { LOCATION_CHANGE } from 'react-router-redux';
import reducer, { initialState } from '../../src/reducers/route_reducer';

describe('route_reducer.test.js | >>>', () => {
  it('1. should return the initial state', () => {
    expect(reducer(initialState, { payload: {}, type: 'test' })).to.deep.equal(initialState);
  });

  it('2. should return the initial state', () => {
    const action = { payload: 'test', type: LOCATION_CHANGE };
    const change = reducer(initialState, action).get('locationBeforeTransitions');
    expect(change).to.equal('test');
  });
});
