"use strict";
const urlJoin = require("url-join");
const axios = require("axios");
const semver = require("semver");
function getNpmInfo(npmName, repository) {
  if (!npmName) return null;
  const repositoryUrl = repository || getDefaultRepo();
  const npmInfoUrl = urlJoin(repositoryUrl, npmName);
  return axios
    .get(npmInfoUrl)
    .then((result) => {
      if (result.status == 200) {
        return result.data;
      }
      return null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}
function getDefaultRepo(isOriginal = false) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npm.taobao.org";
}
function getSemverVersions(baseVersion,versions) {
    
    return versions
        .filter(version=>semver.satisfies(version,`^${baseVersion}`))
        .sort((a,b)=>semver.gt(b,a))
}
async function getNpmVersions(npmName, repository) {
    const data = await getNpmInfo(npmName, repository)
    if(data){
        return Object.keys(data.versions)
    }else{
        return []
    }
}

async function getNpmSemverVersions(baseVersion,npmName,repository) {
    const versions = await getNpmVersions(npmName,repository)
    const newVersions = getSemverVersions(baseVersion,versions)
    if(newVersions && newVersions.length>0){
        return newVersions[0]
    }
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersions
};
