module.exports = start;

function start() {
  if (this.pool) {
    throw new Error('this PMysql instance is already started');
  }

  this.pool = this.mysql.createPool(this.config);
}
