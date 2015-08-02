var assert = require('assert'),
    sinon = require('sinon');

var PMysql = require('lib/PMysql');

describe('start', function() {
  var self, createPoolRetval;

  beforeEach(function() {
    createPoolRetval = null;
    self = {
      config: null,
      mysql: {
        createPool: sinon.spy(function() {return createPoolRetval;}),
      },
      pool: null,
    };
  });

  it('should create the connection pool', function() {
    createPoolRetval = 71;
    self.config = {asdf: 'zzz'};

    PMysql.prototype.start.call(self);

    assert.strictEqual(self.pool, createPoolRetval);
    assert(self.mysql.createPool.calledWith(self.config));
  });

  it('should only allow starting once', function() {
    createPoolRetval = {};
    PMysql.prototype.start.call(self);

    assert(self.mysql.createPool.callCount, 1);

    try {
      PMysql.prototype.start.call(self);
      assert(false);
    } catch (e) {
      assert.strictEqual(e.message, 'this PMysql instance is already started');
      assert(self.mysql.createPool.callCount, 1);
    }
  });
});
