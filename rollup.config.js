const { builtinModules } = require('module');
const ts = require('@wessberg/rollup-plugin-ts');
const pkg = require('./package.json');

const external = Object.freeze([
  ...builtinModules,
  ...Object.keys(pkg.dependencies),
]);

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
    },
  ],
  plugins: [ts()],
  external,
};
