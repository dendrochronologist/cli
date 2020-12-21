import t from 'tap';
import { run } from './helpers';

t.test('cli', async (t) => {
  const { stderr } = await run();
  t.match(stderr, 'Count those tree rings!');
});
