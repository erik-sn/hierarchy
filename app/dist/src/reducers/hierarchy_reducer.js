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
exports.initialState = {
    sites: undefined,
    error: false,
};
exports.default = function (state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case types_1.default.FETCH_HIERARCHY:
            if (action.error) {
                return __assign({}, state, { error: true });
            }
            return __assign({}, state, { sites: action.payload.data });
        default:
            return state;
    }
};
