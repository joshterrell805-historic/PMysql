var assert = require('assert');

var PMysql = require('lib/PMysql');

describe('start', function() {
  it('should create the connection pool', function() {
    var config = null;
    var pMysql = new PMysql('the config', {
      createPool: function(conf) {
        config = conf;
        return 23;
      },
    });

    // before calling
    assert.strictEqual(pMysql.pool, null);

    pMysql.start();

    // the pool is equal to what createPool returned
    assert.strictEqual(pMysql.pool, 23);
    // the config passed to createPool is whatever the user passed to the
    // constructor of PMysql
    assert.strictEqual(config, 'the config');
  });
});
