/* eslint-disable  */
import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import runPolyfills from './utils/polyfill';

// keep all style imports in this js file so webpack imports them
import App from './app';


// support for ie11
runPolyfills();


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
render(
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
    render(
      <AppContainer>
         <NextApp />
      </AppContainer>,
      rootEl,
    );
  });
}
