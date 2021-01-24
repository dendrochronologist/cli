import { resolve } from 'path';
import { processLogger } from './process-logger';
import type { MinimalLogger } from './process-logger';
import type { ParsedConfig } from './cli';

interface RunOptions extends Partial<ParsedConfig> {
  logger?: MinimalLogger;
}

export function run({
  logger = processLogger(),
  ...options
}: RunOptions): void {
  logger.resume();
  logger.info('run', 'Count those tree rings!');

  const cwd = options.cwd ? resolve(options.cwd) : process.cwd();
  logger.silly('run', 'cwd = %j', cwd);
}
