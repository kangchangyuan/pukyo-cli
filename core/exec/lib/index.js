'use strict';
module.exports = exec;
const path = require('path')
const Package = require('@pukyo-cli/package')
const SETTINGS = {
    init:'@pukyo-cli/init'
}
const CACHE_PATH = 'dependencies'
async function exec() {
    // TODO
    let pkg=null;
    let targetPath = process.env.CLI_TARGET_PATH
    let storePath = ''
    const homePath = process.env.CLI_HOME_PATH
    const cmdObject = arguments[arguments.length-1]
    const cmdName = cmdObject.name()
    const packageName = SETTINGS[cmdName]
    const packageVersion = 'latest'
    if(!targetPath){
        targetPath=path.resolve(homePath,CACHE_PATH)
        storePath = path.resolve(targetPath,'node_modules')
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion,
            storePath
        })
        if(await pkg.exists()){
             // 更新package
           await pkg.update()
        }else{
            // 安装package
           await pkg.install()
        }
    }else{
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion,
            storePath
        })
    }
    const rootFile = pkg.getRootFilePath()
    if(rootFile){
        require(rootFile).apply(null,arguments)
    }
    
}
