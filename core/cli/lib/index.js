'use strict';

module.exports = core;

const semver = require('semver');
const colors = require('colors/safe');
const log = require('@pukyo-cli/log');

const  pkg = require('../package.json');
const  constant = require('./const')

function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        // checkRoot()
    } catch (error) {
        log.error(error.message)
    }
    
}
// function checkRoot() {
//     import rootCheck from 'root-check';
//     // const rootCheck =  require('root-check');
//     rootCheck()
// }
function checkNodeVersion() {
    const currentNodeVersion = process.version
    const lowestVersion = constant.LOWEST_NODE_VERSION
    if(!semver.gte(currentNodeVersion,lowestVersion)){
        throw new Error(colors.red(`请安装大于等于v${lowestVersion}的node.js`))
    }
}
function checkPkgVersion() {
    log.notice('cli-version', pkg.version)
}
