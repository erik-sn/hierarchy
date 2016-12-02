import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import types from '../../src/actions/types';
import reducer, { initialState } from '../../src/reducers/display_reducer';

describe('auth_reducer.test.js | >>>', () => {
  const component = <h1>Test Child!</h1>;

  it('1. should return the initial state', () => {
    expect(reducer(initialState, { payload: {}, type: 'test' })).to.deep.equal(initialState);
  });

  it('2. should return the correct value for show modal', () => {
    const result = reducer(initialState, { payload: { showModal: true, component }, type: types.SHOW_MODAL });
    expect(result.get('modal').get('showModal')).to.equal(true);
    const modal = shallow(result.get('modal').get('component').toJS());
    expect(modal.contains(component)).to.equal(true);
  });

  it('3. should return the correct value for hide modal', () => {
    const input = {
      payload: undefined,
      type: types.HIDE_MODAL,
    };
    const result = reducer(Map({ modal: Map({ showModal: true, component: <h1>A</h1> }) }), input);
    expect(result.get('modal').get('showModal')).to.equal(false);
    expect(result.get('modal').get('component')).to.equal(undefined);
  });
});
