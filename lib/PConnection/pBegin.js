module.exports = pBegin;

var assert = require('assert'),
    Promise = require('bluebird');

function pBegin() {
  this.assertNotReleased();

  assert(this.transactionLevel >= 0, 'invalid transaction level'); 

  var p = Promise.resolve();

  if (this.transactionLevel === 0) {
    p = p.then(this.pQuery.bind(this, 'BEGIN'));
  }

  return p
  .then(this.pQuery.bind(this, 'SAVEPOINT ' + this.savepointPrefix +
      ++this.transactionLevel))
  .return(this.transactionLevel);
}
