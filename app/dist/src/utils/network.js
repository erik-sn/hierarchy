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
var axios = require('axios');
var types_1 = require("../actions/types");
function getApiConfig() {
    var CancelToken = axios.CancelToken;
    var axiosSource = CancelToken.source();
    var config = __assign({}, types_1.default.API_CONFIG, { cancelToken: axiosSource.token });
    return { config: config, axiosSource: axiosSource };
}
exports.getApiConfig = getApiConfig;
