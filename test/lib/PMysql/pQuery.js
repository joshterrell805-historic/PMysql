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
      assert(self.pool.query.calledWith(1, 2, 3, 4, 5));
    });
  });
});
