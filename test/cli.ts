import t from 'tap';
import path from 'path';
import { run } from './helpers';

t.test('cli', async (t) => {
  const { stderr, exitCode } = await run();
  t.match(stderr, 'Count those tree rings!');
  t.is(exitCode, 0);
});

t.test('--quiet', async (t) => {
  const { stderr } = await run(['--quiet']);
  t.is(stderr, '');
});

t.test('--verbose', async (t) => {
  const { stderr } = await run(['--verbose']);
  t.match(stderr, `loglevel: 'verbose'`);
});

t.test('--loglevel=silly', async (t) => {
  const { stderr } = await run(['--loglevel=silly']);
  t.match(stderr, `loglevel: 'silly'`);
});

t.test('--loglevel=poop', async (t) => {
  const { stderr, exitCode } = await run(['--loglevel=poop']);
  t.is(exitCode, 1);
  t.match(stderr, 'Invalid values:');
});

t.test('--cwd', async (t) => {
  const { stderr } = await run(['--loglevel=silly', '--cwd=custom']);
  t.match(stderr, `cwd = "${path.resolve('custom')}"`);
});
