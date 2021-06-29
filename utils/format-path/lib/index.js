'use strict';
const path = require('path')

module.exports = function formatPath(p) {
    if(p && typeof p =='string'){
        const sep = path.sep
        if(sep!=='/'){
           p= p.replace(/\\/g,'/') 
        }
    }
    console.log(p);
    return p

}


