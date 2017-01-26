import types from '../actions/types';

import { IAction, IHierarchy } from '../constants/interfaces';

export const initialState = {};

interface IDepartmentIdMap {
  [key: number]: any;
}

export default (state: any = initialState, action: IAction) => {
  switch (action.type) {
    case types.FETCH_DEPARTMENT_DATA: {
      if (action.error) {
        return {...state, error: true };
      }
      const { department, key } = action.meta;
      const departmentState: any = state[department] || {};
      departmentState[key] = action.payload.data;
      return {...state, [department]: departmentState };
    }
    case types.SET_DEPARTMENT_DATA: {
      const { department, key, reducerData } = action.payload;
      const departmentState = state[department] || {};
      departmentState[key] = reducerData;
      return {...state, [department]: departmentState };
    }
    default:
      return state;
  }
};
