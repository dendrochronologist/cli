import t from 'tap';
import { run } from '../src/api.js';

t.test('run()', (t): void => {
  const logged: string[] = [];
  const logger = (msg: string): void => {
    logged.push(msg);
  };
  run({ logger });
  t.is(logged[0], 'Count those tree rings!');
  t.done();
});
