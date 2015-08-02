var assert = require('assert'),
    sinon = require('sinon'),
    Promise = require('bluebird');

var PConnection = require('lib/PConnection');

describe('assertNotReleased', function() {
  it('should do nothing if not relased', function() {
    var self = {};
    PConnection.prototype.assertNotReleased.call(self);
  });

  it('should throw if released relased', function() {
    var self = {released: true};
    try {
      PConnection.prototype.assertNotReleased.call(self);
      assert(false);
    } catch(e) {
      assert.strictEqual(e.message, 'cannot use a released connection');
    }
  });
});
