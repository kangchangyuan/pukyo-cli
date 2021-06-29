'use strict';

module.exports = exec;
const Package = require('@pukyo-cli/package')
const SETTINGS = {
    init:'@pukyo-cli/init'
}
function exec() {
    // TODO
    const targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH
    const cmdObject = arguments[arguments.length-1]
    const cmdName = cmdObject.name()
    const packageName = SETTINGS[cmdName]
    const packageVersion = 'latest'
    const pkg = new Package({
        targetPath,
        packageName,
        packageVersion
    })
}
