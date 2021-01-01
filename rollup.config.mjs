import { builtinModules } from 'module';
import ts from '@wessberg/rollup-plugin-ts';
import { dependencies } from './package.json';

/** @type {import('rollup').ExternalOption} */
const external = [
  ...builtinModules,
  ...Object.keys(dependencies),
  // explicit subpath import allowlist (this should be very short)
  'yargs/yargs',
  'yargs/helpers',
];

/** @type {import('rollup').RollupOptions} */
export default {
  input: ['src/api.ts', 'src/cli.ts'],
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      esModule: false,
    },
    {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].mjs',
      chunkFileNames: '[name]-[hash].mjs',
      minifyInternalExports: false,
    },
  ],
  plugins: [ts()],
  external,
};
