#!/usr/bin/env node
const commander = require('commander');
const publish = require('./src/publish');
const create = require('./src/create');
const list = require('./src/list');
const remove = require('./src/remove');
const program = new commander.Command();


const cmdPublish = program.command('publish').description('Publish the app to the stitch service.').usage("[command] [options]");;
cmdPublish.action((cmd, opts) => {
  publish(process.cwd());
});



const cmdCreate = program.command('create')
cmdCreate.description('Create an app from templates.').usage("[command] <args>");
cmdCreate.requiredOption('-t, --template <name>', 'Name of template to use.')
cmdCreate.option('-p, --project <project-name>', 'Project name')
cmdCreate.action((opts) => {
  create(process.cwd(), opts);
});


const cmdList = program.command('list')
cmdList.description('List all apps.').usage("[command] <args>");
cmdList.option('-p, --profile <name>', 'Name of server profile (leave empty for default).')
cmdList.action((opts) => {
  list(process.cwd(), opts);
});



const cmdRemove = program.command('rm')
cmdRemove.description('Remove an app.').usage("[command] <args>");
cmdRemove.requiredOption('-a, --app <id>', 'Id of app to remove.')
cmdRemove.action((opts) => {
  remove(process.cwd(), opts);
});



program.parse(process.args);
