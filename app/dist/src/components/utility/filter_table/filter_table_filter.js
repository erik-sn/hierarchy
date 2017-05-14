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
var lodash_1 = require("lodash");
var TextField_1 = require("material-ui/TextField");
var React = require("react");
/**
 * @class Filter
 * @extends {Component}
 */
var Filter = (function (_super) {
    __extends(Filter, _super);
    /**
     * Creates an instance of Filter.
     *
     * @param {any} props
     *
     * @memberOf Filter
     */
    function Filter(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            filterValue: '',
        };
        _this.handleChange = _this.handleChange.bind(_this);
        if (props.updateFilter) {
            _this.updateFilter = lodash_1.debounce(props.updateFilter, 150);
        }
        return _this;
    }
    /**
     * Call the parent's updateFilter method when a change
     * event occurs on the text field'
     *
     * @param {object} event
     *
     * @memberOf Filter
     */
    Filter.prototype.handleChange = function (event) {
        event.preventDefault();
        var filterValue = event.currentTarget.value;
        if (this.updateFilter) {
            this.updateFilter(filterValue);
        }
        this.setState({ filterValue: filterValue });
    };
    Filter.prototype.render = function () {
        var hintAny = 'matching any filter';
        var hintAll = 'matching all filters';
        var hintText = this.props.filterAny ? hintAny : hintAll;
        return (React.createElement(TextField_1.default, { id: "filter_table__filter-field", style: { width: '100%' }, hintStyle: { color: '#999', fontStyle: 'italic' }, hintText: "Enter comma separated filters - " + hintText, value: this.state.filterValue, onChange: this.handleChange }));
    };
    return Filter;
}(React.Component));
exports.default = Filter;
