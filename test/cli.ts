import os from 'os';
import t from 'tap';
import { run } from './helpers';

// a common implicit CWD to avoid root manifest pollution
process.chdir(
  // @ts-expect-error (yes t.testdir exists)
  t.testdir({
    'package.json': JSON.stringify({
      name: 'test-cli',
    }),
  }) as string
);

// parallelize tests, leaving one CPU to coordinate
t.jobs = os.cpus().length - 1;

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
  // @ts-expect-error (yes t.testdir exists)
  const cwd = t.testdir({
    'package.json': JSON.stringify({
      name: 'custom-cwd',
    }),
  }) as string;

  const { stderr } = await run(['--loglevel=silly', '--cwd', cwd]);
  t.match(stderr, `cwd = "${cwd}"`);
});
