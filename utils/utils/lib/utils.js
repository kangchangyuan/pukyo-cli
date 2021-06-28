'use strict';

function isObject(p) {
    return Object.prototype.toString.call(p) ==='[object Object]'
}
module.exports = {
    isObject
};
