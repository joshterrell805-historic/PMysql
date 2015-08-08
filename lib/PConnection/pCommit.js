module.exports = pCommit;

var assert = require('assert'),
    Promise = require('bluebird');

function pCommit() {
  this.assertNotReleased();

  assert(this.transactionLevel >= 0, 'invalid transaction level'); 

  if (this.transactionLevel === 0) {
    return Promise.reject(new Error('no transaction to commit!'));
  }

  var p = Promise.resolve();

  if (--this.transactionLevel === 0) {
    p = p.then(this.pQuery.bind(this, 'COMMIT'));
  } 

  return p.return(this.transactionLevel);
}
