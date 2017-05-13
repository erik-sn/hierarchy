import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import App from './app';
import { detectIE } from './utils/dom';

injectTapEventPlugin();  // material-ui support

const render = (Component: any) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./app', () => { render(App); });
}

if (detectIE()) {
  // must do this after mount so the body exists
  // tslint:disable-next-line:max-line-length
  const background: string = 'url(\'https://res.cloudinary.com/dvr87tqip/image/upload/v1487600371/grid_dinlrq_lx4syh.png\') !important';
  const body: any = document.getElementById('app-body');
  body.style.backgroundImage = background;
}
