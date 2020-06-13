var mime = require('mime-types');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const request = require('request');

const upload = async (filePath, asset, progress) => {
    return new Promise((resolve, reject) => {
      var stats = fs.statSync(filePath);
      fs.createReadStream(filePath).pipe(request({
        method: 'PUT',
        url: asset.presignedS3Url,
        headers: {
          'Content-Length': stats['size']
        }
      }, function (err, res, body) {
        if(err) {
          reject(err);
        }
        else {
          progress(`    ${asset.file}`)
          resolve();
        }
      }));
    });
}

module.exports = async (dir, item, progress) => {
    // upload each asset attached to item.
    const promises = [];
    item.assets.forEach(async (asset) => {
      const filePath = path.join(dir, asset.file);
      const promise = upload(filePath, asset, progress);
      promises.push(promise);
    });
    await Promise.all(promises);
}
