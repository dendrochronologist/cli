import t from 'tap';
import { resolve } from 'path';
import util from 'util';
import { run } from '../src/api';

const logged: Map<string, string[]> = new Map();

process.on('log', (level, _prefix, ...args: string[]) => {
  const msg =
    args.length > 1 ? util.format(args[0], ...args.slice(1)) : args[0];
  logged.set(level, (logged.get(level) || []).concat(msg));
});

t.afterEach((done) => {
  logged.clear();
  done();
});

t.test('run()', async (t) => {
  const tree = await run({});
  t.is(tree.package.name, 'dendrochronologist');
  t.is(tree.path, resolve('.'), 'cwd is defaulted to process.cwd()');
  t.is(logged.get('resume')?.length, 1, 'logger.resume()');
  t.is(logged.get('info')![0], 'Count those tree rings!');
});

t.test('run({ cwd })', async (t) => {
  // @ts-expect-error (yes t.testdir exists)
  const cwd = t.testdir({
    'package.json': JSON.stringify({
      name: 'explicit-root',
    }),
  });
  const tree = await run({ cwd });
  t.is(tree.package.name, 'explicit-root');
  t.is(tree.path, cwd, 'cwd is customized by options.cwd');
});
