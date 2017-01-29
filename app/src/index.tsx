/* eslint-disable  */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

// keep all style imports in this js file so webpack imports them
import App from './app';

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

injectTapEventPlugin();

const rootEl: HTMLElement = document.getElementById('root');
ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl,
);

if (module.hot) {
  module.hot.accept('./app', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./app').default;
    ReactDOM.render(
      <AppContainer>
         <NextApp />
      </AppContainer>,
      rootEl,
    );
  });
}