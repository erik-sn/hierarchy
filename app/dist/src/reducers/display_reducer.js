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
var types_1 = require("../actions/types");
var config = require('../../appconfig.json');
exports.initialState = {
    config: config,
    modal: { showModal: false, component: undefined },
};
exports.default = function (state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case types_1.default.SHOW_MODAL:
            return __assign({}, state, { modal: action.payload });
        case types_1.default.HIDE_MODAL:
            return __assign({}, state, { modal: exports.initialState.modal });
        default:
            return state;
    }
};
