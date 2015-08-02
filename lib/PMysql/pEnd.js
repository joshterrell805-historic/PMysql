module.exports = pEnd;

var Promise = require('bluebird');

function pEnd() {
  try {
    this.assertRunning();
  } catch (e) {
    return Promise.reject(e);
  }

  this.ended = true;

  return new Promise(function(resolve, reject) {
    this.pool.end(function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  }.bind(this));
}
