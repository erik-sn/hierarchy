"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require("axios");
var types_1 = require("./types");
var appConfig = require('../../appconfig.json');
function fetchAuth() {
    if (appConfig.authUrl) {
        var request = axios.get(appConfig.authUrl, types_1.default.API_CONFIG);
        return {
            payload: request,
            type: types_1.default.FETCH_AUTH,
        };
    }
    else {
        return {
            payload: {
                id: undefined,
                username: 'guest',
                ip: undefined,
                admin: false,
                email: undefined,
            },
            type: types_1.default.FETCH_AUTH_GUEST,
        };
    }
}
exports.fetchAuth = fetchAuth;
function fetchHierarchy(params) {
    var request = axios.get(types_1.default.API + "/sites/" + (params || ''), types_1.default.API_CONFIG);
    return {
        payload: request,
        type: types_1.default.FETCH_HIERARCHY,
    };
}
exports.fetchHierarchy = fetchHierarchy;
