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
var file_download_1 = require("material-ui/svg-icons/file/file-download");
var React = require("react");
var CsvGenerator = (function (_super) {
    __extends(CsvGenerator, _super);
    function CsvGenerator(props) {
        var _this = _super.call(this, props) || this;
        _this.generateCsv = _this.generateCsv.bind(_this);
        _this.generateContent = _this.generateContent.bind(_this);
        return _this;
    }
    /**
     * Retrieve data, which should be a flat javascript object, and the
     * fileName to be used from component properties and download a .CSV
     * file to the client. Each object represents a row, and each property
     * within the object a column.
     */
    CsvGenerator.prototype.generateCsv = function () {
        var _a = this.props, data = _a.data, _b = _a.params, params = _b === void 0 ? [] : _b, fileName = _a.fileName;
        if (!data || !fileName) {
            console.warn('No data or file name has been set on the CSV Generator');
            return;
        }
        // generate CSV file contents from the object
        var header = params.map(function (param) { return param.header; });
        var content = this.generateContent(data, header, params);
        var blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName + ".csv");
        }
        else {
            var link = document.createElement('a');
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', fileName + ".csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
            }
        }
    };
    CsvGenerator.prototype.stripCommas = function (value) {
        if (typeof value === 'string') {
            return value.replace(/,/g, '');
        }
        return value;
    };
    /**
     * Generate a comma seperated values (CSV) file based on a javascript object. This
     * object needs to be flat - nested objects are not supported.
     * @param  {object} rowData
     * @param  {array} header array of strings representing table header
     * @param  {object} params table parameters
     * @return  {string} content
     */
    CsvGenerator.prototype.generateContent = function (rowData, header, params) {
        var content = '';
        // make a single header row
        if (header && header.length > 0) {
            content += header.reduce(function (prev, current) { return prev + "," + current; });
            content += '\r\n';
        }
        // iterate over data array - each object is a row, each property is a column
        for (var _i = 0, rowData_1 = rowData; _i < rowData_1.length; _i++) {
            var obj = rowData_1[_i];
            for (var _a = 0, params_1 = params; _a < params_1.length; _a++) {
                var param = params_1[_a];
                var label = param.label;
                // remove all commas in values to .csv file does not get corrupted
                content += (obj[label] !== undefined ? this.stripCommas(obj[label]) : '') + ",";
            }
            content += '\r\n';
        }
        return content;
    };
    CsvGenerator.prototype.render = function () {
        var _a = this.props, customClass = _a.customClass, customStyle = _a.customStyle, showTooltip = _a.showTooltip;
        return (React.createElement("div", { className: "download__container" },
            showTooltip ? React.createElement("div", { className: "download__container-tooltip tooltip" }, "Download CSV")
                : undefined,
            React.createElement(file_download_1.default, { className: "csv__container" + (customClass ? " " + customClass : ''), color: "#FFFFFF", type: "button", style: customStyle, onClick: this.generateCsv })));
    };
    return CsvGenerator;
}(React.Component));
exports.default = CsvGenerator;
