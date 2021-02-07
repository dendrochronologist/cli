import t from 'tap';
import { processLogger } from '../src/process-logger';

const logger = processLogger();

process.once('log', (level, prefix, message, ...args) =>
  t.same(
    [level, prefix, message, ...args],
    ['warn', 'prefix', 'message', 'extra']
  )
);
logger.warn('prefix', 'message', 'extra');

process.once('log', (...args) => t.same(args, ['pause']));
logger.pause();

t.same(Object.keys(logger), [
  // levels
  'silly',
  'verbose',
  'info',
  'http',
  'notice',
  'warn',
  'error',
  'silent',
  // methods
  'pause',
  'resume',
]);
