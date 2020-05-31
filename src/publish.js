const YAML = require('yamljs');
const path = require('path');
const axios = require('axios');
var fs = require('fs');
const AWS = require('aws-sdk');
const { zip } = require('zip-a-folder');
const request = require('request');
var tar = require('tar-fs');
var http = require('http');
var recursive = require("recursive-readdir");
var s3Upload = require('./lib/s3Upload');


const host = "https://epywlgqvlf.execute-api.us-east-1.amazonaws.com/stage/";
//const host = "http://localhost:3355/stage/"

module.exports = async (dir) => {
  // get the config.yml file.
  const configPath = path.join(dir, 'package.json');
  const configJSON = fs.readFileSync(configPath);
  const config = JSON.parse(configJSON);


  console.log("host", host)
  //console.log("config", config);
  try {

    //get all the assets in the publish_dir
    const assets = await recursive(config.stitch.publish_dir, [ "*.html", "*.map"]);
    const cleanAssets = assets.map(f => f.replace(config.stitch.publish_dir, ''));

    // create the entry in the server.
    let resUpload = await axios.post(host + 'api/app/upload', {
      name: config.name,
      version: config.version,
      config: JSON.stringify(config),
      assets: JSON.stringify(cleanAssets)
    });

    // app item from server.
    const item = resUpload.data;

    // get entry config
    const publishDir = config.stitch.publish_dir;
    const publishPath = path.join(dir, publishDir);
    await s3Upload(publishPath, item);

    // promote item
    let resPublish = await axios.post(host + `api/app/publish?id=${item.id}&name=${item.name}`);
    return resPublish;


  }
  catch (e) {
    console.error('Error:', e);
  }






}


