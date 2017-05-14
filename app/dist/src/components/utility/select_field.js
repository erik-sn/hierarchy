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
Object.defineProperty(exports, "__esModule", { value: true });
var Menu_1 = require("material-ui/Menu");
var MenuItem_1 = require("material-ui/MenuItem");
var Popover_1 = require("material-ui/Popover/Popover");
var check_box_outline_blank_1 = require("material-ui/svg-icons/toggle/check-box-outline-blank");
var TextField_1 = require("material-ui/TextField");
var React = require("react");
var react_dom_1 = require("react-dom");
var selections_presenter_1 = require("./selections_presenter");
var SelectField = (function (_super) {
    __extends(SelectField, _super);
    function SelectField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Main Component Wrapper methods
         */
        _this.handleClick = function () {
            _this.openMenu(); // toggle instead of close ? (in case user changes  targetOrigin/anchorOrigin)
        };
        _this.handleKeyDown = function (event) {
            if (/ArrowDown|Enter/.test(event.key)) {
                _this.openMenu();
            }
        };
        /**
         * Popover methods
         */
        _this.handlePopoverClose = function (reason) {
            _this.closeMenu(); // toggle instead of close ? (in case user changes targetOrigin/anchorOrigin)
        };
        /**
         * SelectionPresenter methods
         */
        _this.handleTextFieldAutocompletionFiltering = function (event, searchText) {
            _this.setState({ searchText: searchText }, function () { return _this.focusTextField(); });
        };
        _this.handleTextFieldKeyDown = function (event) {
            switch (event.key) {
                case 'ArrowDown':
                    _this.focusFirstMenuItem();
                    break;
                case 'Escape':
                    _this.clearTextField(undefined);
                    _this.closeMenu();
                    break;
                default: break;
            }
        };
        /**
         * Menu methods
         */
        _this.handleMenuSelection = function (event, selectedMenuItem) {
            var _a = _this.props, multiple = _a.multiple, onSelect = _a.onSelect, name = _a.name;
            onSelect(selectedMenuItem, name);
            multiple
                ? _this.clearTextField(function () { return _this.focusTextField(); })
                : _this.closeMenu();
        };
        _this.handleMenuEscKeyDown = function () {
            _this.closeMenu();
        };
        _this.handleMenuKeyDown = function (event) {
            // if event.stopPropagation(), nothing works, so the correct trigger is the 2nd one
            switch (event.key) {
                case 'ArrowUp':
                    _this.focusTextField();
                    break;
                case 'ArrowDown':
                    break;
                case 'PageUp':
                    break;
                case 'PageDown':
                    _this.focusLastMenuItem();
                    break;
                default: break;
            }
        };
        return _this;
    }
    SelectField.prototype.componentWillMount = function () {
        this.setState({ isOpen: false, searchText: '' });
    };
    // for debugging/styling purposes, set this to null
    // to disable list autoclosing on clickAway
    SelectField.prototype.closeMenu = function () {
        var _this = this;
        this.setState({ isOpen: false, searchText: '' }, function () {
            react_dom_1.findDOMNode(_this.root).focus();
        });
    };
    SelectField.prototype.openMenu = function () {
        var _this = this;
        this.setState({ isOpen: true }, function () {
            _this.focusTextField();
        });
    };
    SelectField.prototype.clearTextField = function (callback) {
        this.setState({ searchText: '' }, callback);
    };
    SelectField.prototype.focusTextField = function () {
        if (this.props.children.length > 10) {
            var input = react_dom_1.findDOMNode(this.searchTextField).getElementsByTagName('input')[0];
            input.focus();
        }
    };
    SelectField.prototype.focusFirstMenuItem = function () {
        var firstMenuItem = react_dom_1.findDOMNode(this.menu).querySelector('[tabindex="0"]');
        firstMenuItem.focus();
    };
    SelectField.prototype.focusLastMenuItem = function () {
        var menuItems = react_dom_1.findDOMNode(this.menu).querySelectorAll('[tabindex]');
        var lastMenuItem = menuItems[menuItems.length - 1];
        lastMenuItem.focus();
    };
    SelectField.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, hintText = _a.hintText, multiple = _a.multiple, children = _a.children, style = _a.style, menuProps = _a.menuProps, autocompleteFilter = _a.autocompleteFilter, displaySelectionsRenderer = _a.displaySelectionsRenderer;
        var menuItems = this.state.isOpen && children &&
            children.reduce(function (nodes, child, index) {
                if (!autocompleteFilter(_this.state.searchText, child.props.label)) {
                    return nodes;
                }
                var isSelected = value.includes(child.props.value);
                return nodes.concat([(React.createElement(MenuItem_1.default, { key: index, tabIndex: index, label: child.props.label, value: child.props.value, checked: multiple && isSelected, leftIcon: (multiple && !isSelected) ? React.createElement(check_box_outline_blank_1.default, null) : null, primaryText: child.props.label, disableFocusRipple: true, innerDivStyle: { paddingTop: 5, paddingBottom: 5 } }))]);
            }, []);
        var menuWidth = this.root ? this.root.clientWidth : null;
        var setRootRef = function (ref) { return (_this.root = ref); };
        var setMenuRef = function (ref) { return (_this.menu = ref); };
        return (React.createElement("div", { ref: setRootRef, tabIndex: 0, style: __assign({ cursor: 'pointer', border: 'none' }, style), onKeyDown: this.handleKeyDown, onClick: this.handleClick, className: this.props.className },
            React.createElement(selections_presenter_1.default, { hintText: hintText, value: value }),
            React.createElement(Popover_1.default, { open: this.state.isOpen, anchorEl: this.root, canAutoPosition: false, anchorOrigin: { vertical: 'top', horizontal: 'left' }, useLayerForClickAway: false, onRequestClose: this.handlePopoverClose },
                children.length > 10 &&
                    React.createElement(TextField_1.default, { name: "autoComplete", 
                        // tslint:disable-next-line:jsx-no-lambda
                        ref: function (ref) { return (_this.searchTextField = ref); }, value: this.state.searchText, hintText: hintText, onChange: this.handleTextFieldAutocompletionFiltering, onKeyDown: this.handleTextFieldKeyDown, style: { marginLeft: 16, width: menuWidth - 16 * 2 } }),
                React.createElement(Menu_1.default, __assign({ ref: setMenuRef }, menuProps, { value: value, multiple: multiple, initiallyKeyboardFocused: true, onChange: this.handleMenuSelection, onEscKeyDown: this.handleMenuEscKeyDown, onKeyDown: this.handleMenuKeyDown, desktop: true, autoWidth: false, width: menuWidth }), menuItems.length
                    ? menuItems
                    : React.createElement(MenuItem_1.default, { primaryText: "No match found", disabled: true })))));
    };
    return SelectField;
}(React.Component));
SelectField.defaultProps = {
    multiple: false,
    disableSearch: false,
    autoComplete: false,
    autocompleteFilter: function (searchText, text) { return (!text || text.toLowerCase().indexOf(searchText.toLowerCase()) > -1); },
};
exports.default = SelectField;
