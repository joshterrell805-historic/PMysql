var assert = require('assert'),
    sinon = require('sinon'),
    Promise = require('bluebird');

var PMysql = require('lib/PMysql'),
    PConnection = require('lib/PConnection');

describe('pConnection', function() {
  var self, getConErr, getConVal;

  beforeEach(function() {
    getConErr = getConVal = null;
    self = {
      assertRunning: sinon.spy(),
      pool: {
        getConnection: sinon.spy(function(callback) {
          if (getConErr) {
            callback(getConErr);
          } else {
            callback(null, getConVal);
          }
        }),
      },
    };
  });

  it('should `this.assertRunning`', function() {
    return PMysql.prototype.pConnection.call(self)
    .then(function() {
      assert.strictEqual(self.assertRunning.callCount, 1);
    });
  });

  it('should resolve to a PConnection initialized with the connection',
      function() {
    var PCon = sinon.spy();
    getConVal = 41;

    return PMysql.prototype.pConnection.call(self, PCon)
    .then(function(con) {
      assert.strictEqual(PCon.callCount, 1);
      assert(PCon.calledWith(getConVal));
      assert(con instanceof PCon);
    });
  });

  it('should resolve to a PConnection (no dep-inj)', function() {
    return PMysql.prototype.pConnection.call(self)
    .then(function(con) {
      assert(con instanceof PConnection);
    });
  });

  it('should reject to the error getConnection returns', function() {
    getConErr = new Error('70');
    
    return PMysql.prototype.pConnection.call(self)
    .then(function() {
      throw new Error('error expected');
    }, function(e) {
      assert.strictEqual(e.message, getConErr.message);
    })
  });
});
