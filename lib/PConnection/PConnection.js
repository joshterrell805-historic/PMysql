module.exports = PConnection;

function PConnection(connection) {
  this.connection = connection;
  this.released = false;
}

PConnection.prototype.pQuery = require('./pQuery');
PConnection.prototype.assertNotReleased = require('./assertNotReleased');
PConnection.prototype.release = require('./release');
