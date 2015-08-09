var assert = require('assert');

var PConnection = require('lib/PConnection');

describe('PConnection (constructor)', function() {
  it('should set the connection', function() {
    var pConnection = new PConnection(17);
    assert.strictEqual(pConnection.connection, 17);
  });
});
