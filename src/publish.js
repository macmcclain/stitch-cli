const YAML = require('yamljs');
const path = require('path');
const axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
const AWS = require('aws-sdk');
const { zip } = require('zip-a-folder');
const request = require('request');
var tar = require('tar-fs');
var http = require('http');
var recursive = require("recursive-readdir");


upload = (file, id, name) => {
  return new Promise((resolve, reject) => {

    var r = request.post(`http://localhost:3355/stage/api/app/upload?id=${id}`);
    var upload = fs.createReadStream(file, { highWaterMark: 5000 });

    upload.pipe(r);

    var upload_progress = 0;
    upload.on("data", function (chunk) {
      upload_progress += chunk.length
      console.log(new Date(), upload_progress);
    })

    upload.on("end", function (res) {
      resolve();
    })
  })

}

tarDirectory = (publishPath, tempPath) => {
  return new Promise((resolve, reject) => {
    tar.pack(publishPath).pipe(fs.createWriteStream(tempPath)).on("finish", function () {
      resolve();
    })
  })
}

module.exports = async (dir) => {
  // get the config.yml file.
  const configPath = path.join(dir, 'package.json');
  const configJSON = fs.readFileSync(configPath);
  const config = JSON.parse(configJSON);


  //console.log("config", config);
  try {

    //get all the assets in the publish_dir
    const assets = await recursive(config.stitch.publish_dir, [ "*.html", "*.map"]);
    const cleanAssets = assets.map(f => f.replace(config.stitch.publish_dir, ''));
    console.log(cleanAssets);



    // create the entry in the server.
    let res = await axios.post('http://localhost:3355/stage/api/app/publish', {
      name: config.name,
      version: config.version,
      config: JSON.stringify(config),
      assets: JSON.stringify(cleanAssets)
    });

    // app item from server.
    const item = res.data;


    // get entry config
    const publishDir = config.stitch.publish_dir;
    const publishPath = path.join(dir, publishDir);


    // temp storage
    const tempPath = path.join(dir, 'tmp.tar');
    if(fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    await tarDirectory(publishPath, tempPath);

    // upload the file.
    const uploadRes = await upload(tempPath, item.id, item.name);

    return uploadRes;


  }
  catch (e) {
    console.error('Error:', e.response.data);
  }






}


