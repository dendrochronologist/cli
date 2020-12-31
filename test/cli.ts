import t from 'tap';
import { run } from './helpers';

t.test('cli', async (t) => {
  const { stderr, exitCode } = await run();
  t.match(stderr, 'Count those tree rings!');
  t.is(exitCode, 0);
});
