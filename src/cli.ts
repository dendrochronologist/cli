import { run } from './api';

export function execute(argv: string[]) {
  console.log(argv);

  run({ logger: console.error });
}
