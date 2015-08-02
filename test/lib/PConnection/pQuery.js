var assert = require('assert'),
    sinon = require('sinon'),
    Promise = require('bluebird');

var PConnection = require('lib/PConnection');

describe('pQuery', function() {
  var self, err, rows;

  beforeEach(function() {
    err = rows = null;
    self = {
      assertNotReleased: sinon.spy(),
      connection: {
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

  it('should `this.assertNotReleased`', function() {
    return PConnection.prototype.pQuery.call(self)
    .then(function() {
      assert.strictEqual(self.assertNotReleased.callCount, 1);
    });
  });

  it('should reject to the error of the query', function() {
    err = 13;
    return PConnection.prototype.pQuery.call(self)
    .then(function() {
      throw new Error('expected error');
    }, function(e) {
      assert.strictEqual(e, err);
    })
  });

  it('should resolve to the results of the query', function() {
    rows = ['zsdf', '43'];
    return PConnection.prototype.pQuery.call(self)
    .then(function(res) {
      assert.strictEqual(res, rows);
    });
  });

  it('should pass arguments to `this.connection.query`', function() {
    return PConnection.prototype.pQuery.call(self, 7, 4, 3, 4, 5)
    .then(function() {
      assert(self.connection.query.calledWith(7, 4, 3, 4, 5));
    });
  });
});
