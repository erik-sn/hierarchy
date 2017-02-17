import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import App from './app';


injectTapEventPlugin();  // material-ui support

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
