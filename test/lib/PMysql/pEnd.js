var vows = require('vows'),
    assert = require('assert');

var PMysql = require('lib/PMysql');

var suite = vows.describe('PMysql');

suite.addBatch({
  'pEnd': {
    '1': {
      topic: function() {
        var pMysql = new PMysql();
        pMysql.pEnd().nodeify(this.callback);
      },
      'reject if no pool': function(err, value) {
        assert.strictEqual(err,
            'Cannot end a pMysql instance that has not been started!');
      },
    },
    '2': {
      'reject if no pool': function(err, value) {
        assert.strictEqual(err,
            'verify that this has different topic');
      },
    }
  },
});

suite.export(module);
