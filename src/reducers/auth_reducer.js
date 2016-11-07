import { Map, fromJS } from 'immutable';

import types from '../actions/types';

export const initialState = Map({
  user: Map({ username: undefined, ip: undefined }),
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
