import types from '../actions/types';
import { IAction, IHierarchy } from '../constants/interfaces';


export const initialState: IHierarchy = {
  sites: undefined,
  error: false,
};

export default (state = initialState, action: IAction) => {
  switch (action.type) {
    case types.FETCH_HIERARCHY:
      if (action.error) {
        return {...state, error: true };
      }
      return {...state, sites: action.payload.data };
    default:
      return state;
  }
};
