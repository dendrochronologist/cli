import { run } from './api';

console.log(process.argv.slice(2));

run({ logger: console.error });
