'use strict';
const  path = require('path')
const pkgDir = require('pkg-dir').sync
const {isObject} = require('@pukyo-cli/utils');
const formatPath = require('@pukyo-cli/format-path')
class Package {
    constructor(options){
        if(!options){
            throw new Error('Package类的参数不能为空')
        }
        if(!isObject(options)){
            throw new Error('Package类的参数必须是对象')
        }
        this.targetPath = options.targetPath
        this.storePath = options.storePath
        this.packageName = options.packageName
        this.packageVersion = options.packageVersion
    }
    exists(){

    }
    install(){

    }
    update(){

    }
    // 获取package 执行入口文件
    getRootFilePath(){
        const dir = pkgDir(this.targetPath)
        if(dir){
            const pkgFile = require(path.resolve(dir,'package.json'))
            if(pkgFile && pkgFile.main){
                return formatPath(path.resolve(dir,pkgFile.main))
            }
        }
        return null
    }
}

module.exports = Package;
