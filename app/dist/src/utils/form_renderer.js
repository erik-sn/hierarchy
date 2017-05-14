"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Checkbox_1 = require("material-ui/Checkbox");
var DatePicker_1 = require("material-ui/DatePicker");
var RadioButton_1 = require("material-ui/RadioButton");
var SelectField_1 = require("material-ui/SelectField");
var TextField_1 = require("material-ui/TextField");
var TimePicker_1 = require("material-ui/TimePicker");
var React = require("react");
exports.renderDateField = function (_a) {
    var input = _a.input, label = _a.label, _b = _a.meta, touched = _b.touched, error = _b.error, custom = __rest(_a, ["input", "label", "meta"]);
    var handleOnChange = function (event, date) { return input.onChange(date); };
    return (React.createElement("div", { className: "mui-form-component" },
        React.createElement(DatePicker_1.default, __assign({ mode: "landscape", onChange: handleOnChange, hintText: label, floatingLabelText: label, errorText: touched && error, value: input.value }, custom))));
};
exports.renderTimeField = function (_a) {
    var input = _a.input, label = _a.label, _b = _a.meta, touched = _b.touched, error = _b.error, custom = __rest(_a, ["input", "label", "meta"]);
    var handleOnChange = function (event, date) { return input.onChange(date); };
    return (React.createElement("div", { className: "mui-form-component" },
        React.createElement(TimePicker_1.default, __assign({ format: "ampm", onChange: handleOnChange, hintText: label, floatingLabelText: label, errorText: touched && error, value: input.value }, custom))));
};
exports.renderTextField = function (_a) {
    var input = _a.input, label = _a.label, _b = _a.meta, touched = _b.touched, error = _b.error, custom = __rest(_a, ["input", "label", "meta"]);
    return (React.createElement("div", { className: "mui-form-component" },
        React.createElement(TextField_1.default, __assign({ hintText: label, floatingLabelText: label, errorText: touched && error }, input, custom))));
};
exports.renderTextArea = function (_a) {
    var input = _a.input, label = _a.label, _b = _a.meta, touched = _b.touched, error = _b.error, custom = __rest(_a, ["input", "label", "meta"]);
    return (React.createElement("div", { className: "mui-form-component" },
        React.createElement(TextField_1.default, __assign({ style: { width: '100%' }, multiLine: true, hintText: label, floatingLabelText: label, errorText: touched && error }, input, custom))));
};
var RenderCheckbox = (function (_super) {
    __extends(RenderCheckbox, _super);
    function RenderCheckbox(props) {
        var _this = _super.call(this, props) || this;
        _this.onCheck = _this.onCheck.bind(_this);
        return _this;
    }
    RenderCheckbox.prototype.onCheck = function (event, checked) {
        this.props.input.onChange(checked);
    };
    RenderCheckbox.prototype.render = function () {
        return (React.createElement(Checkbox_1.default, __assign({}, this.props.input, { label: this.props.label, checked: this.props.input.checked, onCheck: this.onCheck })));
    };
    return RenderCheckbox;
}(React.Component));
exports.RenderCheckbox = RenderCheckbox;
exports.renderSelect = function (_a) {
    var input = _a.input, label = _a.label, meta = _a.meta, children = _a.children;
    var handleOnChange = function (event, value) { return input.onChange(value); };
    return (React.createElement("div", { className: "mui-form-component" },
        React.createElement(SelectField_1.default, __assign({ floatingLabelText: label, errorText: meta.touched && meta.error }, input, { onChange: handleOnChange }), children)));
};
exports.renderRadioGroup = function (_a) {
    var input = _a.input, children = _a.children;
    var handleOnChange = function (event, value) { return input.onChange(value); };
    return (React.createElement("div", { className: "mui-form-component" },
        React.createElement(RadioButton_1.RadioButtonGroup, __assign({}, input, { name: "mui-radio", valueSelected: input.value, onChange: handleOnChange }), children)));
};
exports.renderNullField = function (_a) {
    var input = _a.input;
    return (React.createElement("div", { className: "mui-form-component hidden" },
        React.createElement(TextField_1.default, __assign({ style: { display: 'none' } }, input))));
};
