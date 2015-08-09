var PMysql = require('lib/PMysql'),
    assert = require('assert');

describe('basic', function() {
  var config = {
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  };

  var t = ' ' + process.env.MYSQL_TABLE + ' ';

  it('create table, insert row, select, update, delete, and drop', function() {
    var pMysql = new PMysql(config);
    pMysql.start();

    return pMysql.pQuery('create table'+t+'(val int)')
    .then(function(res){})
    .then(pMysql.pQuery.bind(pMysql, 'insert into'+t+'(val) values (?), (?)',
        [4, 7]))
    .then(function(res) {
      assert.strictEqual(res.affectedRows, 2);
    })
    .then(pMysql.pQuery.bind(pMysql, 'select * from'+t+'order by val'))
    .then(function(res) {
      assert.strictEqual(res.length, 2);
      assert.strictEqual(res[0].val, 4);
      assert.strictEqual(res[1].val, 7);
    })
    .then(pMysql.pQuery.bind(pMysql, 'update'+t+'set val=? where val>?',
        [-13, 4]))
    .then(function(res) {
      assert.strictEqual(res.affectedRows, 1);
    })
    .then(pMysql.pQuery.bind(pMysql, 'select * from'+t+'order by val'))
    .then(function(res) {
      assert.strictEqual(res.length, 2);
      assert.strictEqual(res[0].val, -13);
      assert.strictEqual(res[1].val, 4);
    })
    .then(pMysql.pQuery.bind(pMysql, 'delete from'+t+'where val > ?', [0]))
    .then(function(res) {
      assert.strictEqual(res.affectedRows, 1);
    })
    .then(pMysql.pQuery.bind(pMysql, 'select * from'+t+'order by val'))
    .then(function(res) {
      assert.strictEqual(res.length, 1);
      assert.strictEqual(res[0].val, -13);
    })
    .then(pMysql.pQuery.bind(pMysql, 'drop table'+t));
  });
});
