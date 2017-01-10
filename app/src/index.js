/* eslint-disable  */
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import injectTapEventPlugin from 'react-tap-event-plugin';

// keep all style imports in this js file so webpack imports them
import style from '../static/style';
import App from './app';
import AppConfig from '../appconfig.json';

// check application configuration to make sure all required parameters are set
if (!AppConfig.hasOwnProperty('baseUrl')) {
  throw Error('A Base URL must be specified in the application config - minimum of "/"');
}
if (!AppConfig.hasOwnProperty('name')) {
  throw Error('An application name must be specified in the application configuration');
}
if (!AppConfig.hasOwnProperty('hierarchyapi')) {
  throw Error('The base URL for the hierarchy application API must be specified in the application configuration');
}

injectTapEventPlugin();

const rootEl = document.getElementById('root');
ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl
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
      rootEl
    );
  });
}
