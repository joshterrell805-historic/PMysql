module.exports = pRollback;

var assert = require('assert'),
    Promise = require('bluebird');

function pRollback() {
  this.assertNotReleased();

  assert(this.transactionLevel >= 0, 'invalid transaction level'); 

  if (this.transactionLevel === 0) {
    return Promise.reject(new Error('no transaction to rollback to!'));
  }

  var p = Promise.resolve();

  if (--this.transactionLevel === 0) {
    p = p.then(this.pQuery.bind(this, 'ROLLBACK'));
  } else {
    p = p.then(this.pQuery.bind(this, 'ROLLBACK TO SAVEPOINT ' +
        this.savepointPrefix + (this.transactionLevel + 1)));
  }

  return p.return(this.transactionLevel);
}
