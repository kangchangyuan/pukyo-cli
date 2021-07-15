'use strict';
const semver = require('semver');
const colors = require("colors/safe");
const LOWEST_NODE_VERSION = '12.0.0'
class Command{
    // TODO
    constructor(argv){
        // console.log(argv);
        if(!argv){
            throw new Error('参数不能为空')
        }
        if(!Array.isArray(argv)){
            throw new Error('参数必须为数组')
        }
        if(argv.length<1){
            throw new Error('参数不能为空数组')
        }
        this._argv = argv
        let runner = new Promise((resolver,reject)=>{
            let chain = Promise.resolve();
            chain.then(()=>this.checkNodeVersion())
            chain=chain.then(()=>this.initArgv())
            chain=chain.then(()=>this.init())
            chain=chain.then(()=>this.exec())
            chain.catch(err=>{
                console.log(err.message);
            })
        })
    }
    init(){
        throw new Error(colors.red('需要实现init方法'));
    }
    exec(){
        throw new Error(colors.red('需要实现exec方法'));
    }
    initArgv(){
        this._cmd = this._argv[this._argv.length-1]
        this._argv = this._argv.slice(0,this._argv.length-1)
        // console.log('*****');
        // console.log(this._cmd);
        // console.log('*****');
        // console.log(this._argv);
        // console.log('*****');
    }
    checkNodeVersion() {
        const currentNodeVersion = process.version;
        const lowestVersion = LOWEST_NODE_VERSION;
        if (!semver.gte(currentNodeVersion, lowestVersion)) {
          throw new Error(colors.red(`请安装大于等于v${lowestVersion}的node.js`));
        }
      }
}
module.exports = Command;