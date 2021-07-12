'use strict';
const Command = require('@pukyo-cli/command')
class InitCommand extends Command {
    init(){
        this.packageName = this._argv[0] || ''
        console.log(this._cmd.opts().force);
        console.log(this.packageName);
    }
    exec(){
        
    }
}

function init(argv) {
    return new InitCommand(argv)
}

module.exports = init;
module.exports.InitCommand = InitCommand
