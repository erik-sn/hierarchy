delete process.env.BROWSER;

import * as compression from 'compression';
import * as express from 'express';
import * as http from 'http';
import * as logger from 'morgan';
import * as path from 'path';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { applyMiddleware, createStore  } from 'redux';

import reducers from '../src/reducers/';
import routes from '../src/routes';

declare var global: any;
global.navigator = { userAgent: 'all' };
const app = express(); // delcare application
const PORT = process.env.PORT || 3006;

// material-ui theme
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#0D1313',
    primary2Color: '#0D1313',
    primary3Color: '#0D1313',
    accent1Color: '#999',
  },
});


app.use(compression()); // compress compatible files for quicker client load time
app.use(logger('dev')); // log content

// Set path to public assets
app.use('/hierarchy/static', express.static('dist'));
app.use('/hierarchy/static/media', express.static('dist'));

app.use('*', (req, res) => {
  match({ routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const createStoreWithMiddleware = applyMiddleware()(createStore);
      const html = renderToString(
        <Provider store={createStoreWithMiddleware(reducers)} >
          <MuiThemeProvider muiTheme={muiTheme}>
            <RouterContext {...renderProps} />
          </MuiThemeProvider>
        </Provider>,
      );
      res.status(200).send(renderFullPage(html));
    } else {
      res.status(404).send('Not found');
    }
  });
});

// create server based on application configuration
const server = http.createServer(app);

// start the server listening on specified port
server.listen(PORT);

/**
 * Takes a react rendering in string format and returns a full html page.
 *
 * @param {string} html - react component to be rendered
 * @return {string} full html page
 */
function renderFullPage(html: string): string {
  return `
    <!doctype html>
    <html>
    <head>
      <link href="https://res.cloudinary.com/dvr87tqip/image/upload/v1486861616/logo-dark_nfrr2v.png" rel="shortcut icon" type="image/x-icon" />
      <link rel="stylesheet" href="/hierarchy/static/hierarchy.min.css">
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
      <link href='https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel="stylesheet" type="text/css" />
    </head>
    <body id="app-body">
      <div id="root">${html}</div>
    </body>
    <script src="/hierarchy/static/hierarchy.min.js"></script>
    <script>
      var ua = window.navigator.userAgent;
      if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0) {
        var ieCount = JSON.parse(localStorage.getItem('ieCount')) || 0;
        localStorage.setItem('ieCount', JSON.stringify(ieCount + 1));
        if (ieCount === 0 || ieCount % 5 === 0) {
          alert('We recommend using Google Chrome for this application!');
        }
      }
    </script>
    </html>
  `;
}

