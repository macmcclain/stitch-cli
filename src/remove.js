var fs = require('fs');
var path = require('path');
const prompts = require('prompts');
const chalk = require('chalk');
const profile = require('./lib/profile');
const axios = require('axios');
const { printTable } = require('console-table-printer');


module.exports = async (dir, opts) => {

  // get the host
  const p = profile.load();


  // id of app to delete
  const id = opts.app;

  try {
    let result = await axios.post(p.host + 'api/app/' + id + '/remove');
    const data = result.data;
    console.log(chalk.green(`App '${id}' removed.`));
  } catch (e) {
    console.log(chalk.red(`Unable to remove app '${id}'. The app does not exist or there was an error on the server.`));
  }




}
