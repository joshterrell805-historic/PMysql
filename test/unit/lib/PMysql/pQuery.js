var assert = require('assert'),
    sinon = require('sinon');

var PMysql = require('lib/PMysql');

describe('pQuery', function() {
  var self, err, rows;

  beforeEach(function() {
    err = rows = null;
    self = {
      running: true,
      assertRunning: sinon.spy(function() {
        assert(this.running, 'not running');
      }),
      pool: {
        query: sinon.spy(function() {
          var callback = arguments[arguments.length-1];
          if (err) {
            callback(err);
          } else {
            callback(null, rows);
          }
        }),
      },
    };
  });

  it('should `this.assertRunning`', function() {
    self.running = false;
    return PMysql.prototype.pQuery.call(self)
    .then(function() {
      throw new Error('expected exception');
    }, function(e) {
      assert.strictEqual(self.assertRunning.callCount, 1);
      assert.strictEqual(e.message, 'not running');
    });
  });

  it('should reject to the error of the query', function() {
    err = 11;

    return PMysql.prototype.pQuery.call(self)
    .then(function() {
      throw new Error('expected error was not thrown');
    }, function(e) {
      assert.strictEqual(e, 11);
    })
  });

  it('should resolve to the results of the query', function() {
    rows = ['asdf', '43'];

    return PMysql.prototype.pQuery.call(self)
    .then(function(res) {
      assert.strictEqual(res, rows);
    });
  });

  it('should pass arguments to `this.pool.query`', function() {
    return PMysql.prototype.pQuery.call(self, 1, 2, 3, 4, 5)
    .then(function() {
      assert.strictEqual(self.pool.query.callCount, 1);
      assert.strictEqual(self.pool.query.args[0].length, 6);
      assert.deepEqual(
          self.pool.query.args[0].splice(0, self.pool.query.args[0].length - 1),
          [1, 2, 3, 4, 5]);
      assert(self.pool.query.args[0][0] instanceof Function);
    });
  });

  it('should not pass last argument if it is undefined (chaining)', function() {
    return PMysql.prototype.pQuery.call(self, 1, undefined).return()
    .then(PMysql.prototype.pQuery.bind(self, 2))
    .then(function() {
      assert.strictEqual(self.pool.query.callCount, 2);
      assert.strictEqual(self.pool.query.args[0].length, 2);
      assert.strictEqual(self.pool.query.args[0][0], 1);
      assert.strictEqual(self.pool.query.args[1].length, 2);
      assert.strictEqual(self.pool.query.args[1][0], 2);
    });
  });
});
