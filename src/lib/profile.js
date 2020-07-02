var mkdirp = require('mkdirp');
const path = require('path');
var fs = require('fs');
const YAML = require('yaml')

const getCreateConfigPath = () => {
  // load the profile
  const homedir = require('os').homedir();
  const configPath = path.join(homedir, '.stitch');
  mkdirp.sync(configPath);

  // get the config file
  const configFile = path.join(configPath, 'config');

  return configFile;
}

const load = (name = 'default') => {
  const configFilePath = getCreateConfigPath();

  if(!fs.existsSync(configFilePath)) {
    throw "No config file found. Run stitch config to create one."
  }

  const file = fs.readFileSync(configFilePath, 'utf8')
  const config = YAML.parse(file);

  // try to get the config.
  if(!config[name]) {
    throw Error(`Profile '${name}' could not be found in the stitch cli config file.`)
  }

  // get the profile.
  const p = config[name]

  return p;
}



module.exports = {
  load,
  getCreateConfigPath
}
