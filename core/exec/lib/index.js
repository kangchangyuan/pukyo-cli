'use strict';

module.exports = exec;
const Package = require('@pukyo-cli/package')
function exec() {
    // TODO
    const pkg = new Package()
    console.log(pkg);
    console.log(process.env.CLI_TARGET_PATH);
    console.log(process.env.CLI_HOME_PATH);
    
}
