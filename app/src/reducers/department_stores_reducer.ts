import { fromJS, Map } from 'immutable';

import types from '../actions/types';
import { IAction, IHierarchy } from '../constants/interfaces';

export const initialState = Map({ error: false });

export default (state: any = initialState, action: IAction) => {
  switch (action.type) {
    case types.SET_DEPARTMENT_DATA: {
      if (action.error) {
        return state.set('error', true);
      }
      /**
       * department == department's primary key
       * key == string representing apiCall's keyword
       */
      const { department, key } = action.meta;
      const departmentState = state.get(department) || Map({});
      const departmentKeyData = departmentState.set(key, fromJS(action.payload.data));
      return state.set(department, departmentKeyData);
    }
    default:
      return state;
  }
};
