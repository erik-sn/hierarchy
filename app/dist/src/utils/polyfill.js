// tslint:disable:only-arrow-functions
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// polyfills for IE11 support
function runPolyfills() {
    require('es6-promise').polyfill(); // promise
    // .isNan
    Number.isNaN = Number.isNaN || function (value) {
        return typeof value === 'number' && isNaN(value);
    };
    // .includes
    if (!String.prototype.includes) {
        String.prototype.includes = function (search, start) {
            'use strict';
            if (typeof start !== 'number') {
                start = 0;
            }
            if (start + search.length > this.length) {
                return false;
            }
            else {
                return this.indexOf(search, start) !== -1;
            }
        };
    }
    // .some
    // Production steps of ECMA-262, Edition 5, 15.4.4.17
    // Reference: http://es5.github.io/#x15.4.4.17
    if (!Array.prototype.some) {
        Array.prototype.some = function (fun /*, thisArg*/) {
            'use strict';
            if (this == null) {
                throw new TypeError('Array.prototype.some called on null or undefined');
            }
            if (typeof fun !== 'function') {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(thisArg, t[i], i, t)) {
                    return true;
                }
            }
            return false;
        };
    }
    // .find
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function (predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }
                var o = Object(this);
                // tslint:disable-next-line:no-bitwise
                var len = o.length >>> 0;
                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];
                // 5. Let k be 0.
                var k = 0;
                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    // e. Increase k by 1.
                    k++;
                }
                // 7. Return undefined.
                return undefined;
            },
        });
    }
}
exports.default = runPolyfills;
