if [ "$1" == "coverage" ]; then
  node_modules/mocha/bin/mocha -r blanket -R html-cov \
      `find test/ -name '*-test.js'` > coverage.html
else
  node_modules/mocha/bin/mocha `find test/ -name '*-test.js'`
fi
