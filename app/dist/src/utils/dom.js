"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @export
 * @param {*} e
 * @returns
 */
function getBoundingBox(e) {
    var dropdownRight = e.target.getBoundingClientRect().right;
    var dropdownX = e.target.getBoundingClientRect().left;
    return {
        dropdownX: dropdownX,
        dropdownRight: dropdownRight,
        dropdownY: e.target.getBoundingClientRect().bottom,
        windowWidth: window.innerWidth,
        elementWidth: dropdownRight - dropdownX,
    };
}
exports.default = getBoundingBox;
function getCookie(name) {
    // add type check for document so test environment can
    // be run successfully on server side
    var doc = typeof document === 'undefined' ? '' : document;
    if (doc && doc.cookie && doc.cookie !== '') {
        for (var _i = 0, _a = doc.cookie.split(';'); _i < _a.length; _i++) {
            var cookie = _a[_i];
            // Does this cookie string begin with the name we want?
            if (cookie.trim().substring(0, name.length + 1) === (name + '=')) {
                return decodeURIComponent(cookie.trim().substring(name.length + 1));
            }
        }
    }
}
exports.getCookie = getCookie;
function detectIE() {
    var ua;
    try {
        ua = window.navigator.userAgent;
    }
    catch (e) {
        return true;
    }
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    return false;
}
exports.detectIE = detectIE;
function imagePreload() {
    var images = [
        'https://res.cloudinary.com/dvr87tqip/image/upload/v1487601495/host_small_cxc5vr.png',
        'https://res.cloudinary.com/dvr87tqip/image/upload/v1487601514/host_small_hover_cfpel5.png',
        'https://res.cloudinary.com/dvr87tqip/image/upload/v1486860428/host_br_klz6yq.svg',
        'https://res.cloudinary.com/dvr87tqip/image/upload/v1486860496/host_br_fill_r9lbq4.svg',
        'https://res.cloudinary.com/dvr87tqip/image/upload/v1486860532/host_tab_odxix3.svg',
        'https://res.cloudinary.com/dvr87tqip/image/upload/v1486860569/host_tab_selected_xkl3d4.svg',
        'https://res.cloudinary.com/dvr87tqip/image/upload/v1486860597/host_tab_fill_nrjy2l.svg',
    ];
    images.forEach(function (image) {
        var preloadImage = new Image();
        preloadImage.src = image;
    });
}
exports.imagePreload = imagePreload;
