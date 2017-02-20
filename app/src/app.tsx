import { useBasename } from 'history';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import * as promise from 'redux-promise';

import reducers from './reducers';
import routes from './routes';
import { detectIE } from './utils/dom';
import runPolyfills from './utils/polyfill';


// const useBasename = require('history').useBaseName;
const appConfig = require('../appconfig.json');

// check application configuration to make sure all required parameters are set
if (!appConfig.hasOwnProperty('baseUrl')) {
  throw Error('A Base URL must be specified in the application config - minimum of "/"');
}
if (!appConfig.hasOwnProperty('name')) {
  throw Error('An application name must be specified in the application configuration');
}
if (!appConfig.hasOwnProperty('hierarchyapi')) {
  throw Error('The base URL for the hierarchy application API must be specified in the application configuration');
}


// require all .scss files for deploy if we are not server rendering
// process.env.BROWSER is set in webpack.config.ts in development but deleted
// in the express.js server. This way no .scss files are required while in
// node which will throw an error, but webpack still bundles them.
if (process.env.BROWSER) {
  const requireAll = (r: any) => r.keys().forEach(r);
  requireAll(require.context('../static/sass/', true, /\.scss$/));
  requireAll(require.context('./components/__custom__', true, /\.scss$/));
}

if (detectIE) {
  runPolyfills(); // support for ie11
}

// add redux middleware
const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
// configure redux dev tools
declare const window: any; // make typescript happy
const store = createStoreWithMiddleware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ &&
                                                  window.__REDUX_DEVTOOLS_EXTENSION__());
// add enhanced history configuration where nav events are synced to redux store
// this uses the immutablejs implementation
const history: any = syncHistoryWithStore(browserHistory, store, {
  selectLocationState(state) {
    return state.routing;
  },
});

const muiTheme: any = getMuiTheme({
  palette: {
    primary1Color: '#0D1313',
    primary2Color: '#0D1313',
    primary3Color: '#0D1313',
    accent1Color: '#999',
  },
});

const fetchHistory = () => history;

const App = (): JSX.Element => (
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={useBasename(fetchHistory)({ basename: appConfig.baseUrl })} routes={routes} />
    </MuiThemeProvider>
  </Provider>
);

export default App;
