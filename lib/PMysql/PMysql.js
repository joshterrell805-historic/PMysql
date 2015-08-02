module.exports = PMysql;

function PMysql(config, mysql) {
  this.config = config;
  this.mysql = mysql || require('mysql');
  this.pool = null;
  this.ended = false;
}

PMysql.prototype.start = require('./start');
PMysql.prototype.pEnd = require('./pEnd');
PMysql.prototype.pQuery = require('./pQuery');
PMysql.prototype.assertRunning = require('./assertRunning');
PMysql.prototype.pConnection = require('./pConnection');
