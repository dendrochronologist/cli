import { resolve } from 'path';
import Arborist from '@npmcli/arborist';
import { processLogger } from './process-logger';
import type { ParsedConfig } from './cli';
import type { Node, Logger } from '@npmcli/arborist';

interface RunOptions extends Partial<ParsedConfig> {
  logger?: Logger;
}

export async function run({
  logger = processLogger(),
  ...options
}: RunOptions): Promise<Node> {
  logger.resume();
  logger.info('run', 'Count those tree rings!');

  const cwd = options.cwd ? resolve(options.cwd) : process.cwd();
  logger.silly('run', 'cwd = %j', cwd);

  const arb = new Arborist({
    path: cwd,
  });
  const tree = await arb.loadVirtual().catch(() => arb.loadActual());

  logger.verbose('workspaces', '%O', tree.workspaces);

  return tree;
  /* c8 ignore next */
}
