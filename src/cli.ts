import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import npmlog from 'npmlog';
import { run } from './api';
import { levels } from './process-logger';

export function execute(rawArgv: typeof process.argv) {
  const cli = yargs(hideBin(rawArgv))
    .scriptName('dendrochronologist')
    .usage('$0', 'Version and publish npm packages in a monorepo.')
    .alias('h', 'help')
    .alias('v', 'version');

  // TODO: maybe spread out when hidden options are shown?
  cli.wrap(/* cli.terminalWidth() */ 80);

  const argv = cli.parse();

  npmlog.heading = argv.$0;
  npmlog.pause();
  npmlog.verbose('argv', '%O', argv);

  run({
    ...argv,
    logger: npmlog,
  });
}
