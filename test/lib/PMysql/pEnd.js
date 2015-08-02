var assert = require('assert');

var PMysql = require('lib/PMysql');

describe('pEnd', function() {
  context('pMysql instance is not started', function() {
    it('should reject', function() {
      var pMysql = new PMysql();

      return pMysql.pEnd()
      .then(function() {
        throw new Error('expected error was not thrown');
      }, function(e) {
        assert.strictEqual(e.message,
            'Cannot end a pMysql instance that has not been started!');
      });

    });
  });

  context('pMysql instance is started', function() {
    var err, callCount, pool, pMysql;

    beforeEach(function() {
      err = null;
      callCount = 0;
      pool = {
        end: function(callback) {
          ++callCount;
          callback(err);
        },
      };
      pMysql = new PMysql(null, {
        createPool: function() {
          return pool;
        },
      });
      pMysql.start();
    });

    it('should end the pool and reject if error', function() {
      err = 383;

      pMysql.pEnd()
      .then(function () {
        throw new Error('expected error was not thrown');
      }, function(e) {
        assert.strictEqual(e, 383);
      });
    });

    it('should end the pool and resolve if no error', function() {
        pMysql.pEnd()
        .then(function (val) {
          assert.strictEqual(val, undefined);
        });
    });

    it('should only allow ending once', function() {
      // test using error as this is more likely to break
      err = 383;

      pMysql.pEnd()
      // we should get our pool.end() error
      .then(function () {
        throw new Error('expected error was not thrown');
      }, function(e) {
        assert.strictEqual(e, 383);
        return pMysql.pEnd();
      })
      // and calling a second time results in the already ended error
      .then(function() {
        throw new Error('expected error was not thrown');
      }, function(e) {
        assert.strictEqual(e.message,
            'This pMysql instance has already ended!');
      });
    });
  });
});
