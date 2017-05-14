"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var dom_1 = require("../utils/dom");
var Loader = function (_a) {
    var style = _a.style, scale = _a.scale, fill = _a.fill;
    if (dom_1.detectIE()) {
        return (React.createElement("div", { className: "loading__container", style: style },
            React.createElement("img", { src: "https://res.cloudinary.com/dvr87tqip/image/upload/v1487098118/loader.gif", alt: "Loading..." })));
    }
    return (React.createElement("div", { className: "loading__container", style: style },
        React.createElement("svg", { version: "1.1", id: "Layer_1", x: "0px", y: "0px", width: "60px", height: "60px", viewBox: "0 0 24 30", style: { enableBackground: 'new 0 0 24 30',
                opacity: 0.8,
                transform: "scale(" + (scale || 1) + ")",
                display: 'flex',
                alignContent: 'center',
                justifyContent: 'center',
            } },
            React.createElement("rect", { x: "0", y: "13", width: "4", height: "5", fill: fill || 'whitesmoke' },
                React.createElement("animate", { attributeName: "height", attributeType: "XML", values: "5;21;5", begin: "0s", dur: "0.6s", repeatCount: "indefinite" }),
                React.createElement("animate", { attributeName: "y", attributeType: "XML", values: "13; 5; 13", begin: "0s", dur: "0.6s", repeatCount: "indefinite" })),
            React.createElement("rect", { x: "10", y: "13", width: "4", height: "5", fill: fill || 'whitesmoke' },
                React.createElement("animate", { attributeName: "height", attributeType: "XML", values: "5;21;5", begin: "0.15s", dur: "0.6s", repeatCount: "indefinite" }),
                React.createElement("animate", { attributeName: "y", attributeType: "XML", values: "13; 5; 13", begin: "0.15s", dur: "0.6s", repeatCount: "indefinite" })),
            React.createElement("rect", { x: "20", y: "13", width: "4", height: "5", fill: fill || 'whitesmoke' },
                React.createElement("animate", { attributeName: "height", attributeType: "XML", values: "5;21;5", begin: "0.3s", dur: "0.6s", repeatCount: "indefinite" }),
                React.createElement("animate", { attributeName: "y", attributeType: "XML", values: "13; 5; 13", begin: "0.3s", dur: "0.6s", repeatCount: "indefinite" })))));
};
exports.default = Loader;
