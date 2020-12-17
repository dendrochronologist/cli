import { chmodSync } from 'fs';
import { builtinModules } from 'module';
import { dirname, resolve } from 'path';
import ts from '@wessberg/rollup-plugin-ts';
import pkg from './package.json';

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

export default [
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
        format: 'esm',
        file: pkg.bin.dendrochronologist,
        exports: 'none',
        banner: '#!/usr/bin/env node\n',
      },
    ],
    plugins: [translateExtensions(), ts(), executableFile()],
    external,
  },
];
