import types from '../actions/types';
import { IAction, IAuth } from '../constants/interfaces';

export const initialState: IAuth = {
  user: {
    id: undefined,
    username: undefined,
    ip: undefined,
    admin: false,
  },
  error: false,
};

export default (state: IAuth = initialState, action: IAction) => {
  switch (action.type) {
    case types.FETCH_AUTH:
      if (action.error) {
        return {
          ...state,
          error: true,
        };
      }
      return {
        ...state,
        user: action.payload.data,
      };
    default:
      return state;
  }
};
