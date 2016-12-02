import { Map, fromJS } from 'immutable';

import types from '../actions/types';

export const initialState = Map({
});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DEPARTMENT_DATA: {
      if (action.error) {
        return state.set('error', true);
      }
      const departmentState = state.get(action.meta.department) || Map({});
      const data = departmentState.set(action.meta.key, fromJS(action.payload.data));
      return state.set(action.meta.department, data);
    }
    default:
      return state;
  }
};
