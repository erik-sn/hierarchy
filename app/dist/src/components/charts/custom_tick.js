"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var CustomizedAxisTick = function (_a) {
    var x = _a.x, y = _a.y, stroke = _a.stroke, payload = _a.payload;
    return (React.createElement("g", { transform: "translate(" + x + "," + y + ")" },
        React.createElement("text", { x: 0, y: 0, dy: 10, textAnchor: "end", fill: "#999", transform: "rotate(-25)" }, payload.value)));
};
exports.default = CustomizedAxisTick;
