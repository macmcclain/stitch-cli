var fs = require('fs');
var path = require('path');
const prompts = require('prompts');
const chalk = require('chalk');
const profile = require('./lib/profile');
const axios = require('axios');
const { printTable } = require('console-table-printer');
const YAML = require('yaml')


const printConfig = (configFilePath, isError = false) =>{
  const file = fs.readFileSync(configFilePath, 'utf8')
  if(isError) {
    console.log(chalk.red(file));
  }
  else {
    console.log(chalk.green(file));
  }

}

const getConfig = (configFilePath) =>{
  const file = fs.readFileSync(configFilePath, 'utf8')
  return YAML.parse(file);
}

const getProfiles = (configFilePath) => {
  config = getConfig(configFilePath);
  return Object.keys(config);
}

const existingProfilePrompts = async () => {
  const q = [
    {
      type: 'select',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        { title: 'Create a new profile', description: 'Add a profile to the configuration', value: 'new' },
        { title: 'Edit an existing profile', value: 'edit' },
        { title: 'View current profile', value: 'view' }
      ],
      initial: 0
    }
  ];
  return await prompts(q);
}

const chooseProfile = async (message, configFilePath) => {

  // get a list of the profiles.
  const profiles = getProfiles(configFilePath);

  const options = [];
  profiles.forEach((p) => {
    options.push({
      title: p,
      value: p
    })
  })

  const q = [
    {
      type: 'select',
      name: 'name',
      message: message,
      choices: options,
      initial: 0
    }
  ];

  const response = await prompts(q);


  const config = getConfig(configFilePath);


  return {
    name: response.name,
    profile: config[response.name]
  }

}


module.exports = async (dir, opts) => {

  try {
    let profileExists = false;
    let config = null;
    let defaults = {
      name: 'default',
      host: '',
      access_key: ''
    }

    // get the config file
    const configFilePath = profile.getCreateConfigPath();

    // if it already exists then it needs to be edited.
    if(fs.existsSync(configFilePath)) {

      // config exits, prompt with options.
      const { choice } = await existingProfilePrompts();

      if(choice === 'view') {
        console.log(chalk.green(` `));
        printConfig(configFilePath);
        return;
      } else if(choice === 'new') {
        defaults = {
          name: '',
          host: '',
          access_key: ''
        }
      }  else if(choice === 'edit') {
        const { name, profile } = await chooseProfile('Select profile to edit', configFilePath);

        defaults.name = name;
        defaults.host = profile.host;
        defaults.access_key = profile.access_key

      }


    }
    else {
      // create the config
      fs.closeSync(fs.openSync(configFilePath, 'w'));
    }


    // load the config file.
    const file = fs.readFileSync(configFilePath, 'utf8')
    config = YAML.parse(file);
    if(!config) config = {};

    // ask additional questions.
    const questions = [
      {
        type: 'text',
        name: 'name',
        message: 'Profile Name',
        initial: defaults.name,
        validate: value => value.trim().length === 0 && value != 'default'  ? `Name is Required` : true
      },
      {
        type: 'text',
        name: 'host',
        message: 'Host Url',
        initial: defaults.host
      },
      {
        type: 'text',
        name: 'access_key',
        message: 'Security Access Key',
        initial: defaults.access_key
      }
    ];

    const response = await prompts(questions);

    // might have been aborted.
    if(!response.name || response.name.length === 0) {
      return;
    }



    config[response.name] = {
      host: response.host,
      access_key: response.access_key
    }


    const configYml = YAML.stringify(config);
    fs.writeFileSync(configFilePath, configYml);




    // attempt pinging the app server to make sure that the credentials provided are good.
    console.log(`Validating the host and access_key...`);
    let validationError = false;
    try {
      await axios.post(response.host + `api/ping`, {} , { headers: { 'x-api-key': response.access_key }});
      console.log(chalk.green(`Success! Config saved to '${configFilePath}'`));
    } catch (e) {
      console.log(chalk.red(`Error! The configuration was saved, but the Host or Access Key was invalid.`));
      validationError = true;
    }

    console.log(chalk.green(` `));
    printConfig(configFilePath, validationError);

  } catch (e) {
    console.log(chalk.red(`Unable to setup config file.`, e));
  }




}
