"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Created: 2017-02-04 23:36:54 -05:00
 * Author: erik
 */
var React = require("react");
var Helloworld = function (_a) {
    var parent = _a.parent;
    return (React.createElement("div", { className: "helloworld__container" },
        React.createElement("h3", null, "Hello helloworld"),
        React.createElement("div", { className: "helloworld__parent" },
            "Parent: ",
            parent.name)));
};
exports.default = Helloworld;
