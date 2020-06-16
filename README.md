# Stitch CLI

A CLI (command line client) to create and publish Stitch apps for the Stitch micro-frontend framework.

## Todo

- Add the host option to publish
- Update create to just update provided stitch.yml instead of creating one.

## Install

```shell script
npm install stitch-cli-tool -g
```

## Commands

### Create
Create a new project from a template. Click [here](https://github.com/macmcclain/stitch-templates) for a list of templates.

```shell script
$ stitch create --template vuejs-starter --project your-project-name
```

### Publish
Publish your Stitch app to the server.

```shell script
$ stitch publish --server name-of-your-server-config-entry
```


### List
List all active apps

```shell script
$ stitch list --server name-of-your-server-config-entry
```


### Remove
Remove app by app id.

```shell script
$ stitch remove --app id-of-your-app
```

## Help
See options for each command.

```shell script
$ stitch --help

# example help for a specific command
$ stitch create --help
```
