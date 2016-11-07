import { Map, List, fromJS } from 'immutable';

import types from '../actions/types';

export const initialState = Map({
  sites: List([]),
  error: false,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_HIERARCHY:
      if (action.error) {
        return state.set('error', true);
      }
      return state.set('sites', fromJS(action.payload.data));
    default:
      return state;
  }
};
