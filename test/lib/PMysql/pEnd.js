var assert = require('assert'),
    sinon = require('sinon');

var PMysql = require('lib/PMysql');

describe('pEnd', function() {
  var self, endErr;

  beforeEach(function() {
    endErr = null;
    self = {
      ended: false,
      assertRunning: sinon.spy(function() {
        assert(!self.ended,'(test) ended');
      }),
      pool: {
        end: sinon.spy(function(cb) {cb(endErr);}),
      },
    };
  });

  it('should `this.assertRunning`', function() {
    return PMysql.prototype.pEnd.call(self)
    .then(function() {
      assert.strictEqual(self.assertRunning.callCount, 1);
    });
  });


  it('should end the pool and reject if end-error', function() {
    endErr = 383;

    return PMysql.prototype.pEnd.call(self)
    .then(function () {
      throw new Error('expected error was not thrown');
    }, function(e) {
      assert.strictEqual(e, 383);
    });
  });

  it('should end the pool and resolve if no error', function() {
    return PMysql.prototype.pEnd.call(self);
  });

  it('should only allow ending once', function() {
    assert(!self.ended);
    return PMysql.prototype.pEnd.call(self)
    .then(function() {
      assert(self.ended);
      assert.strictEqual(self.pool.end.callCount, 1);
      return PMysql.prototype.pEnd.call(self);
    })
    .then(function() {
      throw new Error('expected error was not thrown');
    }, function(e) {
      assert(e.message, '(test) ended');
      assert.strictEqual(self.assertRunning.callCount, 2);
      // calling a second time does not result in pool.end getting called
      // a second time
      assert.strictEqual(self.pool.end.callCount, 1);
    });
  });
});
