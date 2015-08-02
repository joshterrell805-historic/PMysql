module.exports = assertNotReleased;

var assert = require('assert');

function assertNotReleased() {
  assert(!this.released, 'cannot use a released connection');
}
