import npmlog from 'npmlog';
import { run } from './api';

export function execute(argv: string[]) {
  console.log(argv);

  npmlog.heading = 'dendrochronologist';

  run({
    logger: npmlog,
  });
}
