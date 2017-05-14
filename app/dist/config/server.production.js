"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
delete process.env.BROWSER;
var compression = require("compression");
var express = require("express");
var http = require("http");
var logger = require("morgan");
var getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var React = require("react");
var server_1 = require("react-dom/server");
var react_redux_1 = require("react-redux");
var react_router_1 = require("react-router");
var redux_1 = require("redux");
var _1 = require("../src/reducers/");
var routes_1 = require("../src/routes");
global.navigator = { userAgent: 'all' };
var app = express(); // delcare application
var PORT = process.env.PORT || 3006;
// material-ui theme
var muiTheme = getMuiTheme_1.default({
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
app.use('*', function (req, res) {
    react_router_1.match({ routes: routes_1.default, location: req.originalUrl }, function (error, redirectLocation, renderProps) {
        if (error) {
            res.status(500).send(error.message);
        }
        else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }
        else if (renderProps) {
            var createStoreWithMiddleware = redux_1.applyMiddleware()(redux_1.createStore);
            var html = server_1.renderToString(React.createElement(react_redux_1.Provider, { store: createStoreWithMiddleware(_1.default) },
                React.createElement(MuiThemeProvider_1.default, { muiTheme: muiTheme },
                    React.createElement(react_router_1.RouterContext, __assign({}, renderProps)))));
            res.status(200).send(renderFullPage(html));
        }
        else {
            res.status(404).send('Not found');
        }
    });
});
// create server based on application configuration
var server = http.createServer(app);
// start the server listening on specified port
server.listen(PORT);
/**
 * Takes a react rendering in string format and returns a full html page.
 *
 * @param {string} html - react component to be rendered
 * @return {string} full html page
 */
function renderFullPage(html) {
    return "\n    <!doctype html>\n    <html>\n    <head>\n      <link href=\"https://res.cloudinary.com/dvr87tqip/image/upload/v1486861616/logo-dark_nfrr2v.png\" rel=\"shortcut icon\" type=\"image/x-icon\" />\n      <link rel=\"stylesheet\" href=\"/hierarchy/static/hierarchy.min.css\">\n      <link href=\"https://fonts.googleapis.com/css?family=Roboto\" rel=\"stylesheet\">\n      <link href='https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel=\"stylesheet\" type=\"text/css\" />\n    </head>\n    <body id=\"app-body\">\n      <div id=\"root\">" + html + "</div>\n    </body>\n    <script src=\"/hierarchy/static/hierarchy.min.js\"></script>\n    <script>\n      var ua = window.navigator.userAgent;\n      if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0) {\n        var ieCount = JSON.parse(localStorage.getItem('ieCount')) || 0;\n        localStorage.setItem('ieCount', JSON.stringify(ieCount + 1));\n        if (ieCount === 0 || ieCount % 5 === 0) {\n          alert('We recommend using Google Chrome for this application!');\n        }\n      }\n    </script>\n    </html>\n  ";
}
