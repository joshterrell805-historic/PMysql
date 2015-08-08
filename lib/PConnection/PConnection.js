module.exports = PConnection;

function PConnection(connection) {
  this.connection = connection;
  this.released = false;
  // transaction level 0 is none, 1 is first, 2 is second, ...
  this.transactionLevel = 0;
  this.savepointPrefix = 'PQUERY_SP_';
}

PConnection.prototype.assertNotReleased = require('./assertNotReleased');

PConnection.prototype.release = require('./release');

PConnection.prototype.pQuery = require('./pQuery');

// The following resolve to the new nested transaction level >= 0
PConnection.prototype.pBegin = require('./pBegin');
PConnection.prototype.pRollback = require('./pRollback');
PConnection.prototype.pCommit = require('./pCommit');
