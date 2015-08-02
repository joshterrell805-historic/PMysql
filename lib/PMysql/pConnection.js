module.exports = pConnection;

var Promise = require('bluebird');

function pConnection(PConnection) {
  this.assertRunning();
  PConnection = PConnection || require('../PConnection');

  return Promise.promisify(this.pool.getConnection.bind(this.pool))()
  .then(function(connection) {
    return new PConnection(connection);
  });
}
