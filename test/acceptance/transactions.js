var PMysql = require('lib/PMysql'),
    assert = require('assert'),
    _ = require('lodash');

describe('transactions', function() {
  var config = {
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 2,
  };

  var t = ' ' + process.env.MYSQL_TABLE + ' ';

  var pMysql = null, con1 = null, con2 = null;

  beforeEach(function() {
    pMysql = new PMysql(config);
    pMysql.start();
    return Promise.all([
      pMysql.pQuery('create table'+t+'(val int)'),
      pMysql.pConnection(),
      pMysql.pConnection(),
    ])
    .then(function(res) {
      con1 = res[1];
      con2 = res[2];
    });
  });

  afterEach(function() {
    // at least one of the connections must be released
    // so we can drop the table.
    try { con1.release(); } catch(e) {}
    try { con2.release(); } catch(e) {}
    return pMysql.pQuery('drop table'+t).return()
    .then(pMysql.pEnd.bind(pMysql))
    .then(function() {pMysql = con1 = con2 = null;});
  });

  it('should keep transactions separate across connections', function() {
    return con1.pBegin().return()
    .then(con1.pQuery.bind(con1, 'insert into'+t+'(val) values (?)', [1]))
    .then(function(res) {assert.strictEqual(res.affectedRows, 1);})

    .then(con2.pQuery.bind(con2, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), []);})

    .then(con1.pQuery.bind(con1, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), [1]);})

    .then(con1.pCommit.bind(con1))
    .return()

    .then(con2.pQuery.bind(con2, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), [1]);})

    .then(con1.pQuery.bind(con1, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), [1]);})
  });

  it('should rollback nested transactions', function() {
    return con1.pBegin().return()

    .then(con1.pQuery.bind(con1, 'insert into'+t+'(val) values (?)', [1]))
    .then(function(res) {assert.strictEqual(res.affectedRows, 1);})

    .then(con1.pBegin.bind(con1)).return()

    .then(con1.pQuery.bind(con1, 'insert into'+t+'(val) values (?)', [2]))
    .then(function(res) {assert.strictEqual(res.affectedRows, 1);})

    .then(con1.pQuery.bind(con1, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), [1, 2]);})

    .then(con2.pQuery.bind(con2, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), []);})

    .then(con1.pRollback.bind(con1)).return()

    .then(con1.pQuery.bind(con1, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), [1]);})

    .then(con2.pQuery.bind(con2, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), []);})

    .then(con1.pRollback.bind(con1)).return()

    .then(con1.pQuery.bind(con1, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), []);})

    .then(con2.pQuery.bind(con2, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), []);})
  });

  it('should commit entire transaction on transaction level = 1', function() {
    return con1.pBegin().return()

    .then(con1.pQuery.bind(con1, 'insert into'+t+'(val) values (?)', [1]))
    .then(function(res) {assert.strictEqual(res.affectedRows, 1);})

    .then(con1.pBegin.bind(con1)).return()

    .then(con1.pQuery.bind(con1, 'insert into'+t+'(val) values (?)', [2]))
    .then(function(res) {assert.strictEqual(res.affectedRows, 1);})

    .then(con1.pQuery.bind(con1, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), [1, 2]);})

    .then(con2.pQuery.bind(con2, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), []);})

    .then(con1.pCommit.bind(con1)).return()

    .then(con1.pQuery.bind(con1, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), [1, 2]);})

    .then(con2.pQuery.bind(con2, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), []);})

    .then(con1.pCommit.bind(con1)).return()

    .then(con1.pQuery.bind(con1, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), [1, 2]);})

    .then(con2.pQuery.bind(con2, 'select * from'+t))
    .then(function(res) {assert.deepEqual(_.pluck(res, 'val'), [1, 2]);})
  });

  it('should release connections', function() {
    var start = Date.now(), wait = 250, epsilon = 5;

    setTimeout(con1.release.bind(con1), wait);

    return pMysql.pConnection()
    .then(function(c1) {
      assert(Date.now() + epsilon >= start + wait);
      assert.strictEqual(c1.connection, con1.connection);

      return c1.pQuery('select * from'+t)
      .then(function(res) {
        assert.strictEqual(res.length, 0);
      });
    });
  });
});
