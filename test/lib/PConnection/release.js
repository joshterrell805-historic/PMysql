var assert = require('assert'),
    sinon = require('sinon'),
    Promise = require('bluebird');

var PConnection = require('lib/PConnection');

describe('release', function() {
  var self, err, rows;

  beforeEach(function() {
    err = rows = null;
    self = {
      released: false,
      assertNotReleased: sinon.spy(),
      connection: {
        release: sinon.spy(),
      },
    };
  });

  it('should `this.assertNotReleased`', function() {
    PConnection.prototype.release.call(self);
    assert.strictEqual(self.assertNotReleased.callCount, 1);
  });

  it('should release the connection', function() {
    assert(!self.released);
    PConnection.prototype.release.call(self);
    assert.strictEqual(self.connection.release.callCount, 1);
    assert(self.released);
  });
});
