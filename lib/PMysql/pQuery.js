module.exports = pQuery;

var Promise = require('bluebird');

function pQuery() {
  try {
    this.assertRunning();
  } catch (e) {
    return Promise.reject(e);
  }

  var args = Array.prototype.slice.call(arguments);
  return new Promise(function(resolve, reject) {
    if (args.length > 0 && args[args.length - 1] === undefined) {
      args.pop();
    }
    args.push(callback);
    this.pool.query.apply(this.pool, args);
    function callback(err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    }
  }.bind(this));
}
