module.exports = PConnection;

function PConnection(connection) {
  this.connection = connection;
}

PConnection.prototype.pQuery = require('./pQuery');
PConnection.prototype.assertNotReleased = function() {require('assert')(false);};
