var assert = require('assert');

var PMysql = require('lib/PMysql');

describe('PMysql (constructor)', function() {
  it('should set the config', function() {
    var pMysql = new PMysql(null);
    assert.strictEqual(pMysql.config, null);

    var pMysql = new PMysql(7);
    assert.strictEqual(pMysql.config, 7);
  });

  it('should accept an optional mysql dependency', function() {
    var pMysql = new PMysql(null, 77);
    assert.strictEqual(pMysql.mysql, 77);

    var pMysql = new PMysql(null);
    assert.strictEqual(pMysql.mysql, require('mysql'));
  });
});
