"use strict";

module.exports = core;
const path = require("path");
// 对比2个版本库的大小
const semver = require("semver");
// 控制台输出文字的颜色
const colors = require("colors/safe");
const commander = require("commander");
// 判断主目录的
const userHome = require("user-home");
// 判断路径是否存在
const pathExists = require("path-exists").sync;

const log = require("@pukyo-cli/log");

const exec = require('@pukyo-cli/exec');
const pkg = require("../package.json");
const constant = require("./const");

const program = new commander.Command();
async function core() {
  try {
    await prepase()
    registerCommand();
  } catch (error) {
    log.error(error.message);
  }
}
// 注册前准备工作
async function prepase() {
    checkRoot();
    checkUserHome();
    checkEnv();
    await checkGlobalUpdate();
}
function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("<command> [options]")
    .version(pkg.version)
    .option("-d, --debug", "是否开启调试模式", false)
    .option("-tp, --targetPath <targetPath>", "是否手动设置本地加载文件路径", '');
  // 注册命令
  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目')
    .action(exec)
  // 开启debug模式
  program.on("option:debug", function () {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = "verbose";
    } else {
      process.env.LOG_LEVEL = "info";
    }
    log.level = process.env.LOG_LEVEL;
  });
  // 写入本地加载文件路径
  program.on("option:targetPath", function () {
    process.env.CLI_TARGET_PATH = program.opts().targetPath
  });
  // 监听未知命令
  program.on("command:*", function (operands) {
    const availableCommands = program.commands.map((cmd) => cmd.name());
    console.error(`error: unknown command '${operands[0]}'`);
    if (availableCommands.length) {
      console.error(`可用命令有：${availableCommands.join(",")}`);
    }
    process.exitCode = 1;
  });
  program.parse(process.argv);
  if (!program.args.length) {
    program.outputHelp();
    console.log();
  }
}
async function checkGlobalUpdate() {
  const { getNpmSemverVersions } = require("@pukyo-cli/get-npm-info");
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  const lastVersion = await getNpmSemverVersions(currentVersion, npmName);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      "更新提示",
      `请手动更新${npmName}，当前版本是：${currentVersion}，最新的版本是：${lastVersion}
        更新命令是 npm i -g ${npmName}`
    );
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



function checkRoot() {
  const rootCheck = require("root-check");
  rootCheck();
}
