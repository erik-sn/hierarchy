"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var testData = [
    { key: 1, value: 'one' },
    { key: 2, value: 'two' },
    { key: 3, value: 'three' },
    { key: 4, value: 'four' },
];
var toList = immutable_1.fromJS(testData);
var isImmutable = immutable_1.fromJS([
    { key: 1, value: 'one' },
    { key: 2, value: 'two' },
    { key: 3, value: 'three' },
    { key: 4, value: 'four' },
]);
