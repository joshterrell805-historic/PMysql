describe('acceptance', function() {
  if (!process.env.MYSQL_HOST) {
    console.log('To run acceptance tests, ' +
        'specify the following environment variables:\n' +
        '   MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_TABLE'
    );
    return;
  }

  require('./basic');
  require('./transactions');
});
