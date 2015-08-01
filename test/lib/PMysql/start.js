var vows = require('vows'),
    assert = require('assert');

var PMysql = require('lib/PMysql');

var suite = vows.describe('PMysql');

suite.addBatch({
  'start': {
    'initialize `this.pool`': function() {
      var config = null;
      var pMysql = new PMysql('the config', {
        createPool: function(conf) {
          config = conf;
          return 23;
        },
      });

      assert.strictEqual(pMysql.pool, null);

      pMysql.start();

      assert.strictEqual(pMysql.pool, 23);
      assert.strictEqual(config, 'the config');
    },
  }
});

suite.export(module);
