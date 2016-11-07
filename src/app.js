import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import promise from 'redux-promise';

import reducers from './reducers';
import routes from './routes';

// add redux middleware
const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
// configure redux dev tools
const store = createStoreWithMiddleware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ &&
                                                  window.__REDUX_DEVTOOLS_EXTENSION__());
// add enhanced history configuration where nav events are synced to redux store
// this uses the immutablejs implementation
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState(state) {
    return state.get('routing').toJS();
  },
});

const App = () => (
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history} routes={routes} />
    </MuiThemeProvider>
  </Provider>
);

export default App;
