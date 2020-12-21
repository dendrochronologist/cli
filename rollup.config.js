const { chmodSync } = require('fs');
const { builtinModules } = require('module');
const { dirname, resolve } = require('path');
const ts = require('@wessberg/rollup-plugin-ts');
const pkg = require('./package.json');

const external = Object.freeze([
  ...builtinModules,
  ...Object.keys(pkg.dependencies),
]);

function executableFile() {
  return {
    name: 'executable file',
    writeBundle(options) {
      chmodSync(options.file, '755');
    },
  };
}

/**
 * Make fancy TS ESM loader work, but avoid breaking Rollup.
 */
function translateExtensions() {
  return {
    name: 'translate extensions',
    resolveId(source, importer) {
      if (importer && source.startsWith('.') && source.endsWith('.js')) {
        return resolve(dirname(importer), source.replace(/\.js$/, '.ts'));
      }
      // defer to other resolvers
      return null;
    },
  };
}

module.exports = [
  {
    input: 'src/api.ts',
    output: [
      { format: 'cjs', file: pkg.exports['.'].default, esModule: false },
      { format: 'esm', file: pkg.exports['.'].import, exports: 'named' },
    ],
    plugins: [translateExtensions(), ts()],
    external,
  },
  {
    input: 'src/cli.ts',
    output: [
      {
        format: 'cjs',
        file: pkg.bin.dendrochronologist,
        exports: 'none',
        banner: '#!/usr/bin/env node\n',
      },
    ],
    plugins: [translateExtensions(), ts(), executableFile()],
    external,
  },
];
