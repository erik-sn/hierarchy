"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("history");
var getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var React = require("react");
var react_redux_1 = require("react-redux");
var react_router_1 = require("react-router");
var react_router_redux_1 = require("react-router-redux");
var redux_1 = require("redux");
var promise = require("redux-promise");
var reducers_1 = require("./reducers");
var routes_1 = require("./routes");
var dom_1 = require("./utils/dom");
var polyfill_1 = require("./utils/polyfill");
// const useBasename = require('history').useBaseName;
var appConfig = require('../appconfig.json');
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
    var requireAll = function (r) { return r.keys().forEach(r); };
    requireAll(require.context('../static/sass/', true, /\.scss$/));
    requireAll(require.context('./components/__modules__', true, /\.scss$/));
}
if (dom_1.detectIE) {
    polyfill_1.default(); // support for ie11
}
// preload all images
dom_1.imagePreload();
// add redux middleware
var createStoreWithMiddleware = redux_1.applyMiddleware(promise)(redux_1.createStore);
var store = createStoreWithMiddleware(reducers_1.default, window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__());
// add enhanced history configuration where nav events are synced to redux store
// this uses the immutablejs implementation
var history = react_router_redux_1.syncHistoryWithStore(react_router_1.browserHistory, store, {
    selectLocationState: function (state) {
        return state.routing;
    },
});
var muiTheme = getMuiTheme_1.default({
    palette: {
        primary1Color: '#11191e',
        primary2Color: '#11191e',
        primary3Color: '#11191e',
        accent1Color: '#999',
    },
});
var fetchHistory = function () { return history; };
var App = function () { return (React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(MuiThemeProvider_1.default, { muiTheme: muiTheme },
        React.createElement(react_router_1.Router, { history: history_1.useBasename(fetchHistory)({ basename: appConfig.baseUrl }), routes: routes_1.default })))); };
exports.default = App;
