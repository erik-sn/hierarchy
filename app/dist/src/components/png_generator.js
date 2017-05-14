"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var image_1 = require("material-ui/svg-icons/image/image");
var React = require("react");
var saveSvgAsPng = require('save-svg-as-png').saveSvgAsPng;
function generateClickHandler(fileName, target) {
    return function () {
        var svg = document.getElementsByClassName(target)[0].getElementsByTagName('svg')[0];
        if (!svg) {
            console.warn("Could not locate svg to download for target: " + target);
        }
        saveSvgAsPng(svg, fileName);
    };
}
var PngGenerator = function (props) {
    var fileName = props.fileName, customClass = props.customClass, customStyle = props.customStyle, showTooltip = props.showTooltip, target = props.target;
    var handleClick = generateClickHandler(fileName, target);
    return (React.createElement("div", { className: "image__container" },
        showTooltip ? React.createElement("div", { className: "image__container-tooltip tooltip" }, "Download Image")
            : undefined,
        React.createElement(image_1.default, { className: "png__container" + (customClass ? " " + customClass : ''), style: customStyle, color: "#FFFFFF", height: 40, width: 40, onClick: handleClick })));
};
exports.default = PngGenerator;
