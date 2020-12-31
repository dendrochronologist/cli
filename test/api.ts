import t from 'tap';
import { run } from '../src/api';

t.test('run()', (t): void => {
  const logged: string[] = [];
  process.on('log', (_level, _prefix, msg: string) => {
    logged.push(msg);
  });
  run({});
  t.is(logged[0], 'Count those tree rings!');
  t.done();
});
