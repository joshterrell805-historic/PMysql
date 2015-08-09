var assert = require('assert'),
    sinon = require('sinon'),
    Promise = require('bluebird');

var PConnection = require('lib/PConnection');

describe('pRollback', function() {
  var self, err, rows;

  beforeEach(function() {
    err = rows = null;
    self = {
      transactionLevel: 0,
      savepointPrefix: 'ABC_',
      assertNotReleased: sinon.spy(),
      pQuery: sinon.spy(function() { return Promise.resolve(); }),
    };
  });

  it('should `this.assertNotReleased`', function() {
    self.transactionLevel = 1;
    PConnection.prototype.pRollback.call(self);
    assert.strictEqual(self.assertNotReleased.callCount, 1);
  });

  it('should assert transactionLevel >= 0', function() {
    self.transactionLevel = -1;
    try {
      PConnection.prototype.pRollback.call(self);
      assert(false);
    } catch (e) {
      assert.strictEqual(e.message, 'invalid transaction level');
    }
  });

  it('should verify transaction level > 0', function() {
    return PConnection.prototype.pRollback.call(self)
    .then(function() {
      throw new Error('expected error not thrown');
    }, function(err) {
      assert.strictEqual(err.message, 'no transaction to rollback to!');
    });
  });

  it('should decrease and return transaction level 2 -> 1', function() {
    self.transactionLevel = 2;
    return PConnection.prototype.pRollback.call(self)
    .then(function(transactionLevel) {
      assert.strictEqual(self.transactionLevel, 1);
      assert.strictEqual(transactionLevel, 1);
    });
  });

  it('should decrease and return transaction level 1 -> 0', function() {
    self.transactionLevel = 1;
    return PConnection.prototype.pRollback.call(self)
    .then(function(transactionLevel) {
      assert.strictEqual(self.transactionLevel, 0);
      assert.strictEqual(transactionLevel, 0);
    });
  });

  it('should rollback to SP_2 if TL=2', function() {
    self.transactionLevel = 2;
    return PConnection.prototype.pRollback.call(self)
    .then(function() {
      assert.strictEqual(self.pQuery.callCount, 1);
      assert.deepEqual(self.pQuery.args[0],
          ['ROLLBACK TO SAVEPOINT ' + self.savepointPrefix + '2', undefined]);
    });
  });

  it('should rollback if TL=1', function() {
    self.transactionLevel = 1;
    return PConnection.prototype.pRollback.call(self)
    .then(function() {
      assert.strictEqual(self.pQuery.callCount, 1);
      assert.deepEqual(self.pQuery.args[0],
          ['ROLLBACK', undefined]);
    });
  });
});
