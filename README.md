# Stitch CLI

A CLI (command line client) to create and publish Stitch apps for the Stitch micro-frontend framework.

## Todo

- Add the host option to publish
- Add option to create in current directory, instead of making a directory each time.
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


### Config
Setup your CLI config to be able to publish to the stitch servers.

```shell script
$ stitch config
```


### Publish
Publish your Stitch app to the server.

```shell script
$ stitch publish --server name-of-your-server-config-entry --profile server-profile-name [optional, defaults to default]
```


### List
List all active apps

```shell script
$ stitch list --server name-of-your-server-config-entry --profile server-profile-name [optional, defaults to default]
```


### Remove
Remove app by app id.

```shell script
$ stitch remove --app id-of-your-app --profile server-profile-name [optional, defaults to default]
```

## Help
See options for each command.

```shell script
$ stitch --help

# example help for a specific command
$ stitch create --help
```
