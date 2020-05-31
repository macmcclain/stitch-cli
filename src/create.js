var fs = require('fs');
var path = require('path');
const loader = require('./lib/loader');
const yaml = require('js-yaml');
const prompts = require('prompts');
const chalk = require('chalk');


const downloadIntoProject = async (dir, templateName, projectName) => {

  // construct file paths for
  const remotePath = `https://raw.githubusercontent.com/macmcclain/stitch-templates/master/dist/${templateName}.tar.gz`
  const tempFilePath = path.join(dir, 'template.tar.gz');

  // download the template and extract.
   await loader.download(remotePath, tempFilePath);

  // rename.
  const extractedPath = path.join(dir, templateName);
  const projectPath = path.join(dir, projectName);
  fs.renameSync(extractedPath, projectPath)

  return projectPath;
}

const generateConfig = async (projectPath, params) => {
  const yamlPath = path.join(projectPath, 'stitch.yml');
  const config = {
    name: params.name,
    label: params.label,
    publish_dir: params.publishDir,
    description: params.description,
    type: params.type
  }

  let yamlStr = yaml.safeDump(config);
  fs.writeFileSync(yamlPath, yamlStr, 'utf8');

}



module.exports = async (dir, opts) => {

  // template name from cli
  const templateName = opts.template;

  // get name
  const projectName = opts.project || opts.template;

  // create an id friendly name
  const projectIdentifier = projectName.replace(/[^\w]/gi, '-');


  // ask additional questions.
  const questions = [
    {
      type: 'text',
      name: 'identifier',
      message: 'Project Identifier',
      initial: projectIdentifier
    },
    {
      type: 'text',
      name: 'label',
      message: 'Project Label',
      initial: projectName
    },
    {
      type: 'text',
      name: 'description',
      message: 'Project Description'
    },
    {
      type: 'select',
      name: 'projectType',
      message: 'Project Type',
      choices: [
        { title: 'app', value: 'app' },
        { title: 'fractal', value: 'fractal' }
      ]
    }
  ];

  const response = await prompts(questions);

  // download project
  console.log(chalk.blue('Downloading template...'));
  let projectPath = null;
  try {
    projectPath = await downloadIntoProject(dir, templateName, response.identifier);
  } catch (e) {
    console.log(chalk.red(`Error downloading tempalate. ${e}`));
    return;
  }



  // generate the stitch.yml file.
  console.log(chalk.blue('Generating stitch.yml...'));
  await generateConfig(projectPath, {
    name: response.identifier,
    label: response.label,
    publishDir: 'dist',
    description: response.description,
    type: response.projectType
  });


  console.log(chalk.green(`Stitch project ready!`));
  console.log(chalk.green(`cd ${projectIdentifier}`));



}
