var assert = require('assert');

var PMysql = require('lib/PMysql');

describe('pQuery', function() {
  // TODO reject on not initialized or ended
  // TODO change method tests to not use instance

  var self, err, rows;

  beforeEach(function() {
    err = rows = null;
    self = {
      pool: {
        query: function(callback) {
          if (err) {
            callback(err);
          } else {
            callback(null, rows);
          }
        },
      },
    };
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
});
