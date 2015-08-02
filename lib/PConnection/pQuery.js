module.exports = pQuery;

function pQuery() {
  try {
    this.assertNotReleased();
  } catch (e) {
    return Promise.reject(e);
  }

  var args = Array.prototype.slice.call(arguments);
  return new Promise(function(resolve, reject) {
    args.push(callback);
    this.connection.query.apply(this.connection, args);
    function callback(err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    }
  }.bind(this));
}
