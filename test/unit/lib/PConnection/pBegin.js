var assert = require('assert'),
    sinon = require('sinon'),
    Promise = require('bluebird');

var PConnection = require('lib/PConnection');

describe('pBegin', function() {
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
    PConnection.prototype.pBegin.call(self);
    assert.strictEqual(self.assertNotReleased.callCount, 1);
  });

  it('should assert transactionLevel >= 0', function() {
    self.transactionLevel = -1;
    try {
      PConnection.prototype.pBegin.call(self);
      assert(false);
    } catch (e) {
      assert.strictEqual(e.message, 'invalid transaction level');
    }
  });

  it('should increase and return transaction level 0 -> 1', function() {
    return PConnection.prototype.pBegin.call(self)
    .then(function(transactionLevel) {
      assert.strictEqual(self.transactionLevel, 1);
      assert.strictEqual(transactionLevel, 1);
    });
  });

  it('should increase and return transaction level 1 -> 2', function() {
    self.transactionLevel = 1;
    return PConnection.prototype.pBegin.call(self)
    .then(function(transactionLevel) {
      assert.strictEqual(self.transactionLevel, 2);
      assert.strictEqual(transactionLevel, 2);
    });
  });

  it('should begin transaction and SP_1 on first call', function() {
    return PConnection.prototype.pBegin.call(self)
    .then(function() {
      assert.strictEqual(self.pQuery.callCount, 2);
      assert.deepEqual(self.pQuery.args[0], ['BEGIN', undefined]);
      assert.deepEqual(self.pQuery.args[1],
          ['SAVEPOINT ' + self.savepointPrefix + '1', undefined]);
    });
  });

  it('should begin SP_2 on second call', function() {
    self.transactionLevel = 1;
    return PConnection.prototype.pBegin.call(self)
    .then(function() {
      assert.strictEqual(self.pQuery.callCount, 1);
      assert.deepEqual(self.pQuery.args[0],
          ['SAVEPOINT ' + self.savepointPrefix + '2', undefined]);
    });
  });
});
