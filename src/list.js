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

  // get all the current items
  let result = await axios.post(p.host + 'api/app/list');
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
    console.log(chalk.red("No apps found"));
  }


}
