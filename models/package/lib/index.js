'use strict';
const  path = require('path')
const pathExists = require("path-exists").sync;
const fse = require('fs-extra')
const pkgDir = require('pkg-dir').sync
const npmInstall =  require('npminstall');
const {isObject} = require('@pukyo-cli/utils');
const {getDefaultRepo, getNpmLatestVersions} = require('@pukyo-cli/get-npm-info');
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
        // 缓存前缀
        this.cacheFilePrefix = this.packageName.replace('/','_')
    }
    
    get cacheFilePath(){
        return path.resolve(this.storePath,this.formatCachePath(this.packageVersion))
    }
    formatCachePath(packageVersion){
        return `_${this.cacheFilePrefix}@${packageVersion}@${this.packageName}`
    }
    getSpecificCacheFilePath(packageVersion){
        return path.resolve(this.storePath,this.formatCachePath(packageVersion))
    }
    async prepase(){
        // 如果缓存路径不存在，创建缓存文件夹
        if(this.storePath && !pathExists(this.storePath)){
            fse.mkdirSync(this.storePath)
        }
        if(this.packageVersion=='latest'){
            this.packageVersion = await getNpmLatestVersions(this.packageName)
        }
        
    }
    async exists(){
        if(this.storePath){
            await this.prepase()
            return pathExists(this.cacheFilePath)
        }else{
            return pathExists(this.targetPath)
        }
    }
    async install(){
       await npmInstall({
            root:this.targetPath,
            storeDir:this.storePath,
            registry:getDefaultRepo(),
            pkgs:[
                { name: this.packageName, version: this.packageVersion },
            ]
        })
    }
    async update(){
        await this.prepase()
        // 获取最新的版本号
        const latestVersion = await getNpmLatestVersions()
        // 如果最新的版本号不存在，更新它
        const latestFilePath = this.getSpecificCacheFilePath(latestVersion)
        if(!pathExists(latestFilePath)){
           await npmInstall({
                root:this.targetPath,
                storeDir:this.storePath,
                registry:getDefaultRepo(),
                pkgs:[
                    { name: this.packageName, version: latestVersion },
                ]
            })
            this.packageVersion = latestVersion
        }
    }
    // 获取package 执行入口文件
    getRootFilePath(){
        function _getRootFile(targetPath) {
            const dir = pkgDir(targetPath)
            if(dir){
                const pkgFile = require(path.resolve(dir,'package.json'))
                if(pkgFile && pkgFile.main){
                    return formatPath(path.resolve(dir,pkgFile.main))
                }
            }
            return null
        }
        if(this.storePath){
            return _getRootFile(this.cacheFilePath)
        }else{
            return _getRootFile(this.targetPath)
        }
        
    }
}

module.exports = Package;
