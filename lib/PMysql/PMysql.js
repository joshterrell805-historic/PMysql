module.exports = PMysql;

function PMysql(config, mysql) {
  this.config = config;
  this.mysql = mysql || require('mysql');
  this.pool = null;
}

PMysql.prototype.start = require('./start');
