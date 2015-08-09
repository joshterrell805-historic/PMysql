var assert = require('assert'),
    sinon = require('sinon');

var PMysql = require('lib/PMysql');

describe('assertRunning', function() {
  it('should do nothing if running', function() {
    var self = {
      pool: true,
      ended: false,
    };
    PMysql.prototype.assertRunning.call(self);
  });

  it('should fail if not started', function() {
    var self = {
      pool: false,
      ended: false,
    };

    try {
      PMysql.prototype.assertRunning.call(self);
      assert(false);
    } catch (e) {
      assert.strictEqual(e.message, 'this PMysql instance has not started');
    }
  });

  it('should fail if ended', function() {
    var self = {
      pool: true,
      ended: true,
    };

    try {
      PMysql.prototype.assertRunning.call(self);
      assert(false);
    } catch (e) {
      assert.strictEqual(e.message, 'this PMysql instance has already ended');
    }
  });
});
