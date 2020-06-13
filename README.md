# Stitch CLI

A CLI (command line client) to create and publish Stitch apps for the Stitch micro-frontend framework.

## Todo

- Add the host option to publish

## Install

```shell script
npm install stitch-cli -g
```

## Commands

### Create
Create a new project from a template. Click [here](https://github.com/macmcclain/stitch-templates) for a list of templates.

```shell script
$ stitch create --template vuejs-starter1 --project your-project-name
```

### Publish
Publish your Stitch app to the server.

```shell script
$ stitch publish --server=name-of-your-server-config-entry
```

## Help
See options for each command.

```shell script
$ stitch --help

# example help for a specific command
$ stitch create --help
```
