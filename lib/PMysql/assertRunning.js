module.exports = assertRunning;

function assertRunning() {
  assert(this.pool, 'this PMysql instance has not started');
  assert(!this.ended, 'this PMysql instance has already ended');
}
