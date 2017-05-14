"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var arrow_drop_down_1 = require("material-ui/svg-icons/navigation/arrow-drop-down");
var React = require("react");
var hrBorderColor = 'rgb(244, 244, 244)';
var hrBorder = {
    bottom: '8px',
    borderStyle: 'none none solid',
    borderTopColor: hrBorderColor,
    borderRightColor: hrBorderColor,
    borderBottomWidth: '1px',
    borderBottomColor: hrBorderColor,
    boxSizing: 'content-box',
    margin: '0px',
    width: '100%',
};
var displaySelectionsRenderer = function (value, hintText) {
    return value.length
        ? typeof value === 'string' ? value : value.join(', ')
        : hintText;
};
var SelectionsPresenter = function (_a) {
    var value = _a.value, hintText = _a.hintText;
    var hintStyle = { flex: 1 };
    if (!value) {
        hintStyle = { flex: 1, color: '#999', fontStyle: 'italic', fontSize: '0.8rem', outline: 'none' };
    }
    return (React.createElement("div", { style: { height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' } },
        React.createElement("div", { style: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' } },
            React.createElement("div", { style: hintStyle }, displaySelectionsRenderer(value, hintText)),
            React.createElement(arrow_drop_down_1.default, { style: { color: 'white' } })),
        React.createElement("hr", { style: hrBorder })));
};
exports.default = SelectionsPresenter;
