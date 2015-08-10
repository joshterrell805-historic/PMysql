## PMysql
A mysql library with a promise interface and support for nested transactions.

#### Installation

```sh
npm install pmysql
```

#### Running Tests

For normal mocha output:

```sh
npm install
npm test
```

To generate `coverage.html` in the root directory:
```sh
npm install
npm test -- coverage
```

#### Example

The following example uses [genny](https://github.com/spion/genny) to clean up
the promises. See the [acceptance tests](test/acceptance/transactions.js) for
examples without generators.

This example is in examples/readme.js.
You can run it via `node --harmony examples/readme.js`.

You'll need to either specify your mysql credentials via environment variables
as shown below, or edit the file to include them.

You'll also need a table called `some_table` with the column `val` of type int.

```sql
create table some_table (val int);
```

```js
var PMysql = require('pmysql'),
    assert = require('assert'),
    genny = require('genny');

var config = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
};

genny.run(main);

function* main() {
  try {
    var pMysql = new PMysql(config);
    pMysql.start();

    var cons = yield Promise.all([pMysql.pConnection(), pMysql.pConnection()]);
    var con1 = cons[0];
    var con2 = cons[1];

    // begin a transaction on con1
    var tl = yield con1.pBegin();

    try {
      // the new transaction level is returned from pBegin, pRollback, and pCommit
      assert.strictEqual(tl, 1);

      // in the first transaction, insert the value 1
      var res = yield con1.pQuery('insert into some_table (val) values (1)');
      assert.strictEqual(res.affectedRows, 1);

      // begin a second, nested transaction on con1
      var tl = yield con1.pBegin();

      try {
        assert.strictEqual(tl, 2);

        // this second insert happens in the second transaction
        var res = yield con1.pQuery('insert into some_table (val) values (2)')
        assert.strictEqual(res.affectedRows, 1);

        // con1 has two records
        var res = yield con1.pQuery('select * from some_table');
        assert.strictEqual(res.length, 2);

        // con2 sees zero
        var res = yield con2.pQuery('select * from some_table');
        assert.strictEqual(res.length, 0);

        throw new Error('then a mysterious error happens');
      } catch (e) {
        // lets rollback the second transaction
        yield con1.pRollback();

        // if we expected the error, lets continue.
        if (e.message === 'then a mysterious error happens') {
          // con1 only has one record now; we rollback the second transaction
          var res = yield con1.pQuery('select * from some_table');
          assert.strictEqual(res.length, 1);

          // con2 still should not see the records (con1 is still in a transaction)
          var res = yield con2.pQuery('select * from some_table');
          assert.strictEqual(res.length, 0);
        } else {
          throw e;
        }
      }

      // commit the first transaction
      yield con1.pCommit();

    } catch (e) {
      // if any uncaught errors happen, lets rollback the first transaction
      yield con1.pRollback();
      // lets just re-throw the error
      throw e;
    }

    // finally, after the first transaction has been committed, con2 can see
    // con1's insertions.
    var res = yield con2.pQuery('select * from some_table');
    assert.strictEqual(res.length, 1);

    // and lets clean the table up so it can the script again.
    var res = yield con2.pQuery('delete from some_table');
    assert.strictEqual(res.affectedRows, 1);

    // don't forget to release the connections when you are done so they can be
    // reused!
    con1.release();
    con2.release();

  } finally {
    // end the connections if you want to exit the program
    yield pMysql.pEnd();
  }
}
```
