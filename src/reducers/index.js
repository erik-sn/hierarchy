import { combineReducers } from 'redux-immutable';
import { reducer as FormReducer } from 'redux-form/immutable';

import AuthReducer from './auth_reducer';
import DisplayReducer from './display_reducer';
import HierarchyReducer from './hierarchy_reducer';
import RouteReducer from './route_reducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  display: DisplayReducer,
  hierarchy: HierarchyReducer,
  routing: RouteReducer,
  form: FormReducer,
});

export default rootReducer;
