'use strict';
module.exports = exec;
const path = require('path')
const cp = require('child_process')
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
        try {
            // 优化开启子进程
            const argv =  Array.from(arguments)
            const cmd = argv[argv.length-1]
            const o = Object.create(null)
            Object.keys(cmd).forEach(key=>{
                if(cmd.hasOwnProperty(key)&& key!=='parent' && !key.startsWith('_')){
                    o[key]=cmd[key]
                }
            })
            argv[argv.length-1] = o
            const code = `require(${rootFile}).call(null,${JSON.stringify(argv)})`
            // require(rootFile).call(null,argv)
            const child = spawn('node',['-e',code],{
                cwd:process.cwd(),
                stdio:'inherit'
            })
            child.on('error',e=>{
                console.log(e.message)
                process.exit(1)
            })
            child.on('exit',e=>{
                console.log('执行命令成功:'+e)
                process.exit(e)
            })
        } catch (error) {
            console.log(error.message);
        }
       
    }
   
}
function spawn(command,args,options) {
    const win32 = process.platform ==='win32'
    const cmd = win32?'cmd':command
    const cmdArgs = win32?['/c'].concat(command,args):args
    return cp.spawn(cmd,cmdArgs,options={})
}
