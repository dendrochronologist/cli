const { builtinModules } = require('module');
const ts = require('@wessberg/rollup-plugin-ts');
const pkg = require('./package.json');

/** @type {import('rollup').ExternalOption} */
const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies),
  // explicit subpath import allowlist (this should be very short)
  'yargs/yargs',
  'yargs/helpers',
];

/** @type {import('rollup').RollupOptions} */
module.exports = {
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
  // @ts-expect-error ("default export" broken from CJS)
  plugins: [ts()],
  external,
};
