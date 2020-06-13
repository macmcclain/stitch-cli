#!/usr/bin/env node
const commander = require('commander');
const publish = require('./src/publish');
const create = require('./src/create');
const program = new commander.Command();


const cmdPublish = program.command('publish').description('Publish the app to the stitch service.').usage("[command] [options]");;
cmdPublish.action((cmd, opts) => {
  publish(process.cwd());
});



const cmdCreate = program.command('create')
cmdCreate.description('Create an app from templates.').usage("[command] <args>");
cmdCreate.requiredOption('-t, --template <name>', 'Name of template to use.')
cmdCreate.requiredOption('-p, --project <project-name>', 'Project name')
cmdCreate.action((opts) => {
  create(process.cwd(), opts);
});



program.parse(process.args);
