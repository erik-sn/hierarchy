import types from '../actions/types';
import { IAction, IDisplay } from '../constants/interfaces';

const config = require('../../appconfig');

export const initialState: IDisplay = {
  config,
  modal: { showModal: false, component: undefined },
};

export default (state = initialState, action: IAction) => {
  switch (action.type) {
    case types.SHOW_MODAL:
      return {...state, modal: action.payload };
    case types.HIDE_MODAL:
      return {...state, modal: initialState.modal };
    default:
      return state;
  }
};
