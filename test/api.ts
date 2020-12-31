import t from 'tap';
import { run } from '../src/api';

t.test('run()', (t): void => {
  const logged: Map<string, string[]> = new Map();
  process.on('log', (level, _prefix, msg: string) => {
    logged.set(level, (logged.get(level) || []).concat(msg));
  });
  run({});
  t.is(logged.get('resume')?.length, 1, 'logger.resume()');
  t.is(logged.get('info')![0], 'Count those tree rings!');
  t.done();
});
