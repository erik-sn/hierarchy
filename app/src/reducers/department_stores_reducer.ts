import { fromJS } from 'immutable';

import types from '../actions/types';
import { IAction, IDepartmentIdMap, IHierarchy } from '../constants/interfaces';

export const initialState = { error: false };


export default (state: any = initialState, action: IAction) => {
  switch (action.type) {
    case types.SET_DEPARTMENT_DATA: {
      if (action.error) {
        return {...state, error: true };
      }
      const { department, key } = action.meta;
      const departmentState: any = state[department] || {};
      departmentState[key] = fromJS(action.payload.data);
      return {...state, [department]: departmentState };
    }
    default:
      return state;
  }
};
