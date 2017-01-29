
import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';

import AuthReducer from './auth_reducer';
import DepartmentStoresReducer from './department_stores_reducer';
import DisplayReducer from './display_reducer';
import HierarchyReducer from './hierarchy_reducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  departmentStores: DepartmentStoresReducer,
  display: DisplayReducer,
  hierarchy: HierarchyReducer,
  routing: routerReducer,
  form: FormReducer,
});

export default rootReducer;
