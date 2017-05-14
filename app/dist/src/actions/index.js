"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require("axios");
var React = require("react");
var modal_1 = require("../components/modal");
var types_1 = require("./types");
function showModal(title, message, child) {
    if (child === void 0) { child = React.createElement("div", null); }
    return {
        payload: {
            showModal: true,
            component: React.createElement(modal_1.default, { title: title, message: message }, child),
        },
        type: types_1.default.SHOW_MODAL,
    };
}
exports.showModal = showModal;
function hideModal() {
    return {
        payload: {
            showModal: false,
        },
        type: types_1.default.HIDE_MODAL,
    };
}
exports.hideModal = hideModal;
function fetchDepartmentData(departmentId, url, key) {
    var request = axios.get(url, types_1.default.API_CONFIG);
    return {
        payload: request,
        type: types_1.default.SET_DEPARTMENT_DATA,
        meta: {
            department: departmentId,
            key: key,
        },
    };
}
exports.fetchDepartmentData = fetchDepartmentData;
