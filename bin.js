#!/usr/bin/env node

/** @type {import('./src/cli')} */
let cli;

if (process.env.DENDROCHRONOLOGIST_TEST_RUNNER) {
  /* eslint-disable node/no-unpublished-require */
  require('ts-node').register({ transpileOnly: true });
  cli = require('./src/cli');
  /* eslint-enable node/no-unpublished-require */
  /* c8 ignore next 5 */
} else {
  // @ts-expect-error (untyped module)
  require('v8-compile-cache');
  cli = require('./dist/cli.js');
}

cli.execute(process.argv);
