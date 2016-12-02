import { Map, fromJS } from 'immutable';

import types from '../actions/types';

export const initialState = Map({
  user: Map({ id: undefined, username: undefined, ip: undefined, admin: false }),
  error: false,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_AUTH:
      if (action.error) {
        return state.set('error', true);
      }
      return state.set('user', fromJS(action.payload.data));
    default:
      return state;
  }
};