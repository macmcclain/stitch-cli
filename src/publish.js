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
const chalk = require('chalk');
var Ajv = require('ajv');
const profile = require('./lib/profile')


//const host = "https://epywlgqvlf.execute-api.us-east-1.amazonaws.com/stage/";
//const host = "http://localhost:3355/stage/"

module.exports = async (dir) => {

  let config = null;

  const p = profile.load();
  const host = p.host;


  try {
    console.log(chalk.green(`Validating stitch.yml file..`));
    // get the config.yml file.
    const configPath = path.join(dir, 'stitch.yml');
    try {
      config = YAML.load(configPath);
      var ajv = new Ajv();
      console.log("config", config)
      const validation = ajv.addSchema(require("./schema/stitch"), 'stitch');
      const valid = validation.validate('stitch', config);
      if (!valid) {
        throw new Error("stitch.yml Validation error: " + ajv.errors.map(e => e.message));
      }

      // validate that the package.json name matches the config name
      const packagePath = path.join(dir, 'package.json');
      const packageFs = fs.readFileSync(packagePath);
      let package = JSON.parse(packageFs);
      if(package.name != config.name) {
        throw new Error(`stitch.yml name: '${config.name}' does not match package.json name: '${package.name}' attribute. They must match.`);
      }

    } catch (e) {
      throw new Error(`Missing or Invalid stitch.yml file ${e.message}`)
    }


    console.log(chalk.green(`Creating new app version... ${config.version}`));

    //get all the assets in the publish_dir
    const assets = await recursive(config.publish_dir, [ "*.html", "*.map"]);
    const cleanAssets = assets.map(f => f.replace(config.publish_dir, ''));


    console.log(chalk.green(`Publishing to ${host}`));
    // create the entry in the server.
    let resUpload = await axios.post(host + 'api/app/upload', {
      name: config.name,
      version: config.version,
      type: config.type,
      config: JSON.stringify(config),
      assets: JSON.stringify(cleanAssets)
    });

    // app item from server.
    const item = resUpload.data;

    // get entry config
    const publishDir = config.publish_dir;
    const publishPath = path.join(dir, publishDir);
    console.log(chalk.green('Uploading package to stitch...'));
    await s3Upload(publishPath, item, (progress) => {
      console.log(chalk.green(progress));
    });

    // promote item
    console.log(chalk.green('Promoting this version...'));
    let resPublish = await axios.post(host + `api/app/publish?id=${item.id}&name=${item.name}`);


    console.log(chalk.green('Done!'));
    return resPublish;


  }
  catch (e) {
    console.error(chalk.red('Error:', e));
  }






}


