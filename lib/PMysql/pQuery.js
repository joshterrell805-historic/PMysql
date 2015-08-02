module.exports = pQuery;

function pQuery() {
  // TODO refactor both of these to shared method
  if (!this.pool) {
    return Promise.reject(new Error(
        'Cannot query a pMysql instance that has not been started!'));
  }
  if (this.ended) {
    return Promise.reject(new Error('This pMysql instance has already ended!'));
  }

  var args = Array.prototype.slice.call(arguments);
  return new Promise(function(resolve, reject) {
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
