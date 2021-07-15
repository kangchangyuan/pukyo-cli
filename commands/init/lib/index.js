'use strict';
const fs = require('fs')
const inquirer = require('inquirer')
const semver = require('semver')
const fsExtra = require('fs-extra')
const Command = require('@pukyo-cli/command')
class InitCommand extends Command {
    init(){
        this.packageName = this._argv[0] || ''
        this.force = this._argv[1].force
        // console.log(this._argv[1].force);
        // console.log(this.packageName);
    }
    async exec(){
        try {
            // 准备阶段
           const projectInfo = await this.prepare()
            // 下载模板
            // 写入文件
        } catch (error) {
            console.log(error.message);
        }
        
    }
    async prepare(){
        // 判断当前目录是否为空
        const localPath = process.cwd()
        const hasNotFiles = this.isEmptyDir(localPath)
        let ifContinue = false
        if(!hasNotFiles){
            if(!this.force){
                ifContinue = (await inquirer.prompt({
                    type:'confirm',
                    name:'ifContinue',
                    default:false,
                    message:'当前文件夹不为空，是否继续创建项目？'
                })).ifContinue
                if(!ifContinue){
                    return
                    
                }
            }
            if(this.force || this.ifContinue){
                const {confirmDelete} = await inquirer.prompt({
                    type:'confirm',
                    name:'confirmDelete',
                    default:false,
                    message:'是否删除目录下的所有文件？'
                })
                if(confirmDelete){
                    fsExtra.emptyDirSync(localPath)
                }
            }
            
        }
        return this.getProjectInfo()
    }
    async getProjectInfo(){
        const projectInfo = {}
        const {projectType} = await inquirer.prompt({
            name:'projectType',
            type:'list',
            message:'请输入初始化类型',
            default:'project',
            choices:[
                {name:'项目',value:'project'},
                {name:'组件',value:'component'}
            ]

        })
        if(projectType== 'project'){
            const i = await inquirer.prompt([
                {
                    name:'projectName',
                    type:'input',
                    message:'请输入项目名称',
                    default:'',
                    validate:function(v) {
                        const reg = /^[a-zA-z]+([-][a-zA-Z0-9]*|[_][a-zA-Z0-9]*|[a-zA-Z0-9]*)*$/
                        const done = this.async()
                        setTimeout(function()  {
                            if(!reg.test(v)){
                                done('请输入合法的项目名称')
                            }
                            done(null,true)
                        }, 0);
                        
                    },
                    filter:function(v) {
                        return v
                    }
                },
                {
                    name:'projectVersion',
                    type:'input',
                    message:'请输入版本号',
                    default:'1.0.0',
                    validate:function(v) {
                        const done = this.async()
                        setTimeout(function()  {
                            if(!(!!semver.valid(v))){
                                done('请输入合法的版本号')
                            }
                            done(null,true)
                        }, 0);
                    },
                    filter:function(v) {
                        if(!!semver.valid(v)){
                            return !!semver.valid(v)
                        }else{
                            return v
                        }
                        
                        
                       
                    }
                },
            ])
            console.log(i);
        }else if(projectType == 'component'){

        }
        // console.log(type);
        return projectInfo
    }
    isEmptyDir(path){
        // 获取当前文件夹路径
        let fileList = fs.readdirSync(path)
        // console.log(fileList);
        fileList = fileList.filter(file=>(!file.startsWith('.') && ['node_modules'].indexOf(file)<0))
        return !fileList || fileList.length<=0
    }
}

function init(argv) {
    
    return new InitCommand(argv)
}

module.exports = init;
module.exports.InitCommand = InitCommand
