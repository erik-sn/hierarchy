import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';
import * as React from 'react';

import types from '../../src/actions/types';
import { IAction, IDisplay } from '../../src/constants/interfaces';
import reducer, { initialState } from '../../src/reducers/display_reducer';

describe('auth_reducer.test.js | >>>', () => {
  const component = <h1>Test Child!</h1>;

  it('should return the initial state', () => {
    expect(reducer(initialState, {
      payload: {},
      type: 'test',
    })).to.deep.equal(initialState);
  });

  it('should return the correct value for show modal', () => {
    const result: IDisplay = reducer(initialState, {
      payload: {
        showModal: true,
        component,
      },
      type: types.SHOW_MODAL,
    });
    expect(result.modal.showModal).to.equal(true);
    const modal = shallow(result.modal.component);
    expect(modal.contains(component)).to.equal(true);
  });

  it('should return the correct value for hide modal', () => {
    const input: IAction = {
      payload: undefined,
      type: types.HIDE_MODAL,
    };
    const result: IDisplay = reducer({
      config: '',
      modal: {
        showModal: true,
        component: <h1>A</h1>,
      },
    }, input);
    expect(result.modal.showModal).to.equal(false);
    expect(result.modal.component).to.equal(undefined);
  });
});
