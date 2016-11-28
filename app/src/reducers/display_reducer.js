import { Map, fromJS } from 'immutable';

import types from '../actions/types';
import config from '../../appconfig.json';

export const initialState = Map({
  config: fromJS(config),
  modal: Map({ showModal: false, component: undefined }),
});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_MODAL:
      return state.set('modal', fromJS(action.payload));
    case types.HIDE_MODAL:
      return state.set('modal', initialState.get('modal'));
    default:
      return state;
  }
};
