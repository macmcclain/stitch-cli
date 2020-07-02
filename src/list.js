var fs = require('fs');
var path = require('path');
const prompts = require('prompts');
const chalk = require('chalk');
const profile = require('./lib/profile');
const axios = require('axios');
const { printTable } = require('console-table-printer');


module.exports = async (dir, opts) => {

  try {
    // get the host
    const p = profile.load(opts.profile);

    // get all the current items
    let result = await axios.post(p.host + 'api/app/list', {}, { headers: { 'x-api-key': p.access_key }});
    const items = result.data;

    // just pull the data we need.
    const filteredItems = items.map(i = (i) => {
      return { id: i.id, type: i.type, version: i.version, status: i.status }
    })

    // shoe the results in table form
    if(filteredItems.length > 0) {
      printTable(filteredItems);
    }
    else {
      throw Error("No apps found");
    }
  } catch (e) {
    console.log(chalk.red(`Unable to list apps. ${e}`));
  }



}
