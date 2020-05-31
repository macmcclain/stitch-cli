'use strict'

const path = require ('path');
const url = require ('url');
const fs = require ('fs');
const http = require ('http');
const https = require ('https');
const { createReadStream, createWriteStream } = require ('fs');
const unpack = require ('tar-pack').unpack;
const chalk = require ('chalk');
var log = console.log;


const download = function (remote, local) {
  let unpackage = true;
  let port = 0;
  let transport = {};
  let contentLength = 0;
  let percent = 0;
  const file = {
    write: {},
    ready: false,
    bytes: 0
  };

  return new Promise((resolve, reject) => {
    if (remote.indexOf ('https') != -1) {
      port = 443;
      transport = https;
    } else {
      port = 80;
      transport = http;
    }
    var request = transport.get ({
      host: url.parse (remote).hostname,
      port: port,
      path: url.parse (remote).pathname
    }, function (response) {
      switch (response.statusCode) {
        case 200:
          contentLength = response.headers['content-length'];
          break;
        case 302:
          download (response.headers.location, local);
          return;
          break;
        case 404:
          reject(`Not found`)
          return;
        default:
          reject(response.statusCode)
          request.abort ();
          return;
      }
      response.on ('data', function (chunk) {
        if(!file.ready) {
          file.write = createWriteStream (local);
          file.ready = true;
        }
        file.write.write (chunk);
        file.bytes += chunk.length;
        percent = parseInt ((file.bytes / contentLength) * 100);
        //log (`${chalk.cyan ('Percent:')} ${chalk.green (percent)}${chalk.green ('%')}`);
      });
      response.on ('end', function () {
        file.write.end (function (argument) {
          if (unpackage) {
            createReadStream (local).pipe (unpack ('./', {keepFiles : true}, function (err) {
              if (err) {
                reject(err);
                return;
                //log (`${chalk.red ('Error:')} ${chalk.red (err)}`);
              }

              // remove the temp file.
              fs.unlinkSync(local);
              resolve();
            }));
          }
          else {
            resolve();
          }
        });
      });

    });
    request.on ('error', function (err) {
      reject(err);
      //log (`${chalk.red ('Error:')} ${chalk.red (err.message)}`);
    });
  });
};


module.exports = {
  download
};
