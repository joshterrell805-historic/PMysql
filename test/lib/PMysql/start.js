var assert = require('assert'),
    sinon = require('sinon');

var PMysql = require('lib/PMysql');

describe('start', function() {
  var createPoolRetval;
  var self = {
    config: 72,
    mysql: {
      createPool: sinon.spy(function() {return createPoolRetval;}),
    },
    pool: null,
  };

  it('should create the connection pool', function() {
    createPoolRetval = 71;

    PMysql.prototype.start.call(self);

    assert.strictEqual(self.pool, createPoolRetval);
    assert(self.mysql.createPool.calledWith(self.config));
  });
});
