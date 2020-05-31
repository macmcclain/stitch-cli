var mime = require('mime-types');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const request = require('request');

const upload = async (filePath, asset) => {
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
          console.error("Error uploading to s3", err);
          reject(err);
        }
        else {
          console.log("res", res)
          resolve();
        }
      }));
    });
}

module.exports = async (dir, item) => {
    // upload each asset attached to item.
    const promises = [];
    item.assets.forEach(async (asset) => {
      const filePath = path.join(dir, asset.file);
      const promise = upload(filePath, asset);
      promises.push(promise);
    });
    await Promise.all(promises);
}
