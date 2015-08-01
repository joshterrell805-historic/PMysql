module.exports = pEnd;

var Promise = require('bluebird');

function pEnd() {
  if (!this.pool) {
    return Promise.reject(
        'Cannot end a pMysql instance that has not been started!');
  }

  if (this.ended) {
    Promse.reject(new Error('This pMysql instance has already ended!'));
  } else {
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
}
