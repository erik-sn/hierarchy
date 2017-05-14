"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var types_1 = require("../actions/types");
exports.initialState = immutable_1.Map({ error: false });
exports.default = function (state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case types_1.default.SET_DEPARTMENT_DATA: {
            if (action.error) {
                return state.set('error', true);
            }
            /**
             * department == department's primary key
             * key == string representing apiCall's keyword
             */
            var _a = action.meta, department = _a.department, key = _a.key;
            var departmentState = state.get(department) || immutable_1.Map({});
            var departmentKeyData = departmentState.set(key, immutable_1.fromJS(action.payload.data));
            return state.set(department, departmentKeyData);
        }
        default:
            return state;
    }
};
