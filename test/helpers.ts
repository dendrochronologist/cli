import * as cp from 'child_process';
import * as path from 'path';
import * as util from 'util';

const node = process.execPath;
const bin = path.resolve(__dirname, '../src/cli.ts');
const execFile = util.promisify(cp.execFile);

export async function run(
  args: string[] = [],
  options?: cp.ExecFileOptionsWithStringEncoding
): Promise<{
  stdout: string;
  stderr: string;
}> {
  return await execFile(node, ['--loader=ts-node/esm', bin].concat(args), {
    encoding: 'utf8',
    ...options,
  });
}
