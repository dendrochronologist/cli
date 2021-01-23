import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import npmlog from 'npmlog';
import { run } from './api';
import { levels } from './process-logger';

function configure(slicedArgv: string[]) {
  return yargs(slicedArgv)
    .scriptName('dendrochronologist')
    .usage('$0', 'Version and publish npm packages in a monorepo.')
    .option('quiet', {
      type: 'boolean',
      describe: 'Only log errors and warnings',
      global: true,
    })
    .option('verbose', {
      type: 'boolean',
      describe: 'Log many details otherwise obscured',
      global: true,
    })
    .option('loglevel', {
      choices: levels.slice().reverse(),
      describe: 'Choose the level of logs explicitly',
      defaultDescription: '"info"',
      global: true,
    })
    .check((argv) => {
      if (argv.quiet) {
        argv.loglevel = 'warn';
      }
      if (argv.verbose) {
        argv.loglevel = 'verbose';
      }
      return true;
    }, true)
    .alias('h', 'help')
    .alias('v', 'version');
}

export function execute(rawArgv: typeof process.argv) {
  const cli = configure(hideBin(rawArgv));

  // TODO: maybe spread out when hidden options are shown?
  cli.wrap(/* cli.terminalWidth() */ 80);

  const argv = cli.parse();

  npmlog.heading = argv.$0;
  npmlog.level = argv.loglevel || 'info';
  npmlog.pause();
  npmlog.verbose('argv', '%O', argv);

  run({
    ...argv,
    logger: npmlog,
  });
}

// Remove index signature from an object with explicit keys
// https://github.com/Microsoft/TypeScript/issues/25987#issuecomment-408339599
type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

type ConfigureArgv = ReturnType<typeof configure>['argv'];
type YargsMetaKeys = '$0' | '_';
type ApiConfigKeys = Exclude<KnownKeys<ConfigureArgv>, YargsMetaKeys>;

/** The parsed config object without yargs-specific keys that would only confuse derived interfaces */
export type ParsedConfig = Pick<ConfigureArgv, ApiConfigKeys>;
