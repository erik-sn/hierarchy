"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var react_hot_loader_1 = require("react-hot-loader");
var injectTapEventPlugin = require("react-tap-event-plugin");
var app_1 = require("./app");
var dom_1 = require("./utils/dom");
injectTapEventPlugin(); // material-ui support
var render = function (Component) {
    ReactDOM.render(React.createElement(react_hot_loader_1.AppContainer, null,
        React.createElement(Component, null)), document.getElementById('root'));
};
render(app_1.default);
if (module.hot) {
    module.hot.accept('./app', function () { render(app_1.default); });
}
if (dom_1.detectIE()) {
    // must do this after mount so the body exists
    // tslint:disable-next-line:max-line-length
    var background = 'url(\'https://res.cloudinary.com/dvr87tqip/image/upload/v1487600371/grid_dinlrq_lx4syh.png\') !important';
    var body = document.getElementById('app-body');
    body.style.backgroundImage = background;
}
