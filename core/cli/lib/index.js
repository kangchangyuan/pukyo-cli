"use strict";

module.exports = core;
const path = require("path");
// 对比2个版本库的大小
const semver = require("semver");
// 控制台输出文字的颜色
const colors = require("colors/safe");
const log = require("@pukyo-cli/log");

// 判断主目录的
const userHome = require("user-home");
// 判断路径是否存在
const pathExists = require("path-exists").sync;

const pkg = require("../package.json");
const constant = require("./const");
let args;
async function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkUserHome();
    checkInputArgs();
    checkEnv();
    await checkGlobalUpdate()
    // log.verbose('debug','test debug log')
    // checkRoot()
  } catch (error) {
    log.error(error.message);
  }
}
async function checkGlobalUpdate() {
    /**
     * 获取本地版本号
     * 获取服务端版本号
     * 对比2者版本号
     */
    const {getNpmSemverVersions} = require('@pukyo-cli/get-npm-info');
    const currentVersion = pkg.version;
    const npmName = pkg.name
    const lastVersion = await getNpmSemverVersions(currentVersion,npmName)
    if(lastVersion && semver.gt(lastVersion,currentVersion)){
        log.warn('更新提示',`请手动更新${npmName}，当前版本是：${currentVersion}，最新的版本是：${lastVersion}
        更新命令是 npm i -g ${npmName}`)
    }
}
function checkEnv() {
  // 检查写入读取环境变量
  const dotEnv = require("dotenv");
  const dotEnvPath = path.resolve(userHome, ".env");
  if (pathExists(dotEnvPath)) {
    dotEnv.config({
      path: dotEnvPath,
    });
  }
  createDefaultConfig();
//   log.verbose("环境变量", process.env.CLI_HOME_PATH);
}
function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig["cliHome"] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig["cliHome"];
  return cliConfig;
}
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("当前用户主目录不存在"));
  }
}
function checkInputArgs() {
  const minimist = require("minimist");
  args = minimist(process.argv.slice(2));
  checkArgs();
}
function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
  log.level = process.env.LOG_LEVEL;
}
function checkNodeVersion() {
  const currentNodeVersion = process.version;
  const lowestVersion = constant.LOWEST_NODE_VERSION;
  if (!semver.gte(currentNodeVersion, lowestVersion)) {
    throw new Error(colors.red(`请安装大于等于v${lowestVersion}的node.js`));
  }
}
function checkPkgVersion() {
  log.notice("cli-version", pkg.version);
}
// function checkRoot() {
//     import rootCheck from 'root-check';
//     // const rootCheck =  require('root-check');
//     rootCheck()
// }