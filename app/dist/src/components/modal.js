"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppBar_1 = require("material-ui/AppBar");
var Dialog_1 = require("material-ui/Dialog");
var FlatButton_1 = require("material-ui/FlatButton");
var error_1 = require("material-ui/svg-icons/alert/error");
var React = require("react");
var react_redux_1 = require("react-redux");
var index_1 = require("../actions/index");
exports.Modal = function (props) {
    var message = props.message, children = props.children, error = props.error, modal = props.modal, title = props.title, onSubmit = props.onSubmit, onCancel = props.onCancel, className = props.className, childClass = props.childClass, contentClass = props.contentClass;
    var ok = (React.createElement(FlatButton_1.default, { label: "Ok", primary: true, keyboardFocused: true, onTouchTap: onSubmit }));
    var cancel = (React.createElement(FlatButton_1.default, { label: "Cancel", primary: true, keyboardFocused: true, onTouchTap: onCancel }));
    var actions = [];
    if (onSubmit) {
        actions.push(ok);
    }
    if (onCancel) {
        actions.push(cancel);
    }
    var errorIconStyle = { marginLeft: '25px', height: '40px', width: '40px', display: 'none' };
    if (error) {
        errorIconStyle.display = 'block';
        actions = [];
    }
    var titleBar = (React.createElement(AppBar_1.default, { style: { height: '50px', padding: '0px' }, iconStyleLeft: { marginTop: '5px' }, titleStyle: { marginLeft: '25px', height: '50px', lineHeight: '50px' }, title: title, iconElementLeft: React.createElement(error_1.default, { style: errorIconStyle, viewBox: "0 0 24 24" }) }));
    return (React.createElement("div", { className: "modal__container" + (className ? " " + className : '') },
        React.createElement(Dialog_1.default, { contentClassName: "modal__dialog-container", bodyClassName: "modal__dialog-body-container", titleStyle: { fontSize: '1.5rem' }, title: titleBar, modal: modal, open: true, onRequestClose: props.hideModal, actions: !modal ? actions : undefined },
            React.createElement("div", { className: "modal__message-container" + (contentClass ? " " + contentClass : '') }, message),
            React.createElement("div", { className: ("modal__child-container " + (childClass || '')).trim() }, children))));
};
var ModalContainer = react_redux_1.connect(null, { hideModal: index_1.hideModal })(exports.Modal);
exports.default = ModalContainer;
