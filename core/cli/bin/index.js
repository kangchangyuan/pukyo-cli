#! /usr/bin/env node

const importLocal = require('import-local')
const log = require('@pukyo-cli/log')
if(importLocal(__filename)){
  log.info('cli','正在使用本地 pukyo-cli 版本')
}else{
  require('../lib')(process.argv.slice(2));
}