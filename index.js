#!/usr/bin/env node
const commander = require('commander');
const publish = require('./src/publish');
const program = new commander.Command();


const cmdPublish = program.command('publish').description('Publish the app to the stitch service.').usage("[command] [options]");;
cmdPublish.action((cmd, opts) => {
  publish(process.cwd());
});
program.addCommand(cmdPublish);


program.parse(process.args);
