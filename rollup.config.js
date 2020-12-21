const { chmodSync } = require('fs');
const { builtinModules } = require('module');
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

module.exports = [
  {
    input: 'src/api.ts',
    output: [
      { format: 'cjs', file: pkg.exports['.'].default, esModule: false },
      { format: 'esm', file: pkg.exports['.'].import, exports: 'named' },
    ],
    plugins: [ts()],
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
    plugins: [ts(), executableFile()],
    external,
  },
];
