"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_redux_1 = require("react-router-redux");
var redux_1 = require("redux");
var redux_form_1 = require("redux-form");
var auth_reducer_1 = require("./auth_reducer");
var department_stores_reducer_1 = require("./department_stores_reducer");
var display_reducer_1 = require("./display_reducer");
var hierarchy_reducer_1 = require("./hierarchy_reducer");
var rootReducer = redux_1.combineReducers({
    auth: auth_reducer_1.default,
    departmentStores: department_stores_reducer_1.default,
    display: display_reducer_1.default,
    hierarchy: hierarchy_reducer_1.default,
    routing: react_router_redux_1.routerReducer,
    form: redux_form_1.reducer,
});
exports.default = rootReducer;
