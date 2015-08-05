module.exports = release;

function release() {
  this.assertNotReleased();
  this.released = true;
  this.connection.release();
}
