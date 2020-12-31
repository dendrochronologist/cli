import { processLogger } from './process-logger';
import type { MinimalLogger } from './process-logger';

interface RunOptions {
  logger?: MinimalLogger;
}

export function run({ logger = processLogger() }: RunOptions): void {
  logger.info('run', 'Count those tree rings!');
}
