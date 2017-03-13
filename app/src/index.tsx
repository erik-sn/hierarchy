import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import App from './app';
import { detectIE } from './utils/dom';

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

if (detectIE()) {
  // must do this after mount so the body exists
  // tslint:disable-next-line:max-line-length
  const background: string = 'url(\'https://res.cloudinary.com/dvr87tqip/image/upload/v1487600371/grid_dinlrq_lx4syh.png\') !important';
  const body: any = document.getElementById('app-body');
  body.style.backgroundImage = background;
}
