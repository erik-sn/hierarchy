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
Object.defineProperty(exports, "__esModule", { value: true });
var DatePicker_1 = require("material-ui/DatePicker");
var Snackbar_1 = require("material-ui/Snackbar");
var TimePicker_1 = require("material-ui/TimePicker");
var moment = require("moment");
var React = require("react");
var DateRange = (function (_super) {
    __extends(DateRange, _super);
    function DateRange(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            startDate: props.defaultStartDate,
            startTime: undefined,
            endDate: props.defaultEndDate,
            endTime: undefined,
            messageText: '',
            messageShow: false,
        };
        _this.handleEndDateChange = _this.handleEndDateChange.bind(_this);
        _this.handleStartDateChange = _this.handleStartDateChange.bind(_this);
        _this.handleEndTimeChange = _this.handleEndTimeChange.bind(_this);
        _this.handleStartTimeChange = _this.handleStartTimeChange.bind(_this);
        _this.handleMessageClose = _this.handleMessageClose.bind(_this);
        return _this;
    }
    DateRange.prototype.handleStartDateChange = function (event, date) {
        var _a = this.state, startTime = _a.startTime, endDate = _a.endDate, endTime = _a.endTime;
        var startDate = moment(date);
        this.setState({
            startDate: startDate,
            endDate: endDate,
            messageShow: false,
            messageText: '',
        }, this.props.updateParent(startDate, endDate));
    };
    DateRange.prototype.handleStartTimeChange = function (event, date) {
        var _a = this.state, startDate = _a.startDate, endDate = _a.endDate, endTime = _a.endTime;
        var startTimeString = moment(date).format('HH:MM:SS');
        var startDateString = startDate.format('YYYY-MM-DD');
        this.setState({
            startDate: moment(startDateString + "T" + startTimeString),
            endDate: endDate,
            messageShow: false,
            messageText: '',
        }, this.props.updateParent(startDate, endDate));
    };
    DateRange.prototype.handleEndDateChange = function (event, date) {
        var _a = this.state, startDate = _a.startDate, startTime = _a.startTime, endTime = _a.endTime;
        var endDate = moment(date);
        this.setState({
            startDate: startDate,
            endDate: endDate,
            messageShow: false,
            messageText: '',
        }, this.props.updateParent(startDate, endDate));
    };
    DateRange.prototype.handleEndTimeChange = function (event, date) {
        var _a = this.state, startDate = _a.startDate, startTime = _a.startTime, endDate = _a.endDate;
        var endTimeString = moment(date).format('HH:MM:SS');
        var endDateString = endDate.format('YYYY-MM-DD');
        this.setState({
            startDate: startDate,
            endDate: moment(endDateString + "T" + endTimeString),
            messageShow: false,
            messageText: '',
        }, this.props.updateParent(startDate, endDate));
    };
    DateRange.prototype.handleMessageClose = function () {
        this.setState({ messageShow: false });
    };
    DateRange.prototype.render = function () {
        var _a = this.props, containerClass = _a.containerClass, innerContainerClass = _a.innerContainerClass, datePickerClass = _a.datePickerClass, showTime = _a.showTime, disableStart = _a.disableStart, disableEnd = _a.disableEnd;
        var _b = this.state, startDate = _b.startDate, endDate = _b.endDate, messageShow = _b.messageShow, messageText = _b.messageText;
        return (React.createElement("div", { className: ("date_range__container " + (containerClass || '')).trim() },
            React.createElement("div", { className: ("date_range__date-pickers " + (innerContainerClass || '')).trim() },
                !disableStart ? React.createElement(DatePicker_1.default, { key: 1, name: "date_range__start-date", className: ("date_range__date-picker " + (datePickerClass || '')).trim(), value: startDate.toDate(), onChange: this.handleStartDateChange, firstDayOfWeek: 0, autoOk: true }) : undefined,
                showTime ?
                    React.createElement(TimePicker_1.default, { format: "24hr", hintText: "24hr Format", value: startDate.toDate(), onChange: this.handleStartTimeChange }) : undefined,
                !disableEnd ? React.createElement(DatePicker_1.default, { key: 2, name: "date_range__end-date", className: ("date_range__date-picker " + (datePickerClass || '')).trim(), value: endDate.toDate(), onChange: this.handleEndDateChange, firstDayOfWeek: 0, autoOk: true }) : undefined,
                showTime ?
                    React.createElement(TimePicker_1.default, { format: "24hr", hintText: "24hr Format", value: endDate.toDate(), onChange: this.handleEndTimeChange }) : undefined),
            React.createElement(Snackbar_1.default, { className: "date_range__snackbar", style: { marginBottom: '15px' }, open: messageShow, message: messageText, action: "Ok", autoHideDuration: 10000, onActionTouchTap: this.handleMessageClose, onRequestClose: this.handleMessageClose })));
    };
    return DateRange;
}(React.Component));
exports.default = DateRange;
