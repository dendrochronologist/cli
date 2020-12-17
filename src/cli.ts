import { run } from './api.js';

console.log(process.argv.slice(2));

run({ logger: console.error });
