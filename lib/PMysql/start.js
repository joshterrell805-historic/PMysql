module.exports = start;

function start() {
  this.pool = this.mysql.createPool(this.config);
}
