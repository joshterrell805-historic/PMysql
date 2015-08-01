var vows = require('vows'),
    assert = require('assert');

var PMysql = require('lib/PMysql');

var suite = vows.describe('PMysql');

suite.addBatch({
  'constructor': {
    'set config': function() {
      var pMysql = new PMysql(null);
      assert.strictEqual(pMysql.config, null);

      var pMysql = new PMysql(7);
      assert.strictEqual(pMysql.config, 7);
    },
    'optionally accept mysql dependency': function() {
      var pMysql = new PMysql(null, 77);
      assert.strictEqual(pMysql.mysql, 77);

      var pMysql = new PMysql(null);
      assert.strictEqual(pMysql.mysql, require('mysql'));
    },
  }
});

suite.export(module);
