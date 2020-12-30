import * as cp from 'child_process';
import * as path from 'path';
import * as util from 'util';

const node = process.execPath;
const bin = path.resolve(__dirname, '../bin.js');
const execFile = util.promisify(cp.execFile);

export async function run(
  args: string[] = [],
  options?: cp.ExecFileOptionsWithStringEncoding
): Promise<{
  stdout: string;
  stderr: string;
}> {
  return await execFile(node, [bin].concat(args), {
    encoding: 'utf8',
    ...options,
    env: {
      // signal bin entry to require TS src
      DENDROCHRONOLOGIST_TEST_RUNNER: 'true',
      // ensure localization remains stable
      LANG: 'en_US.UTF-8',
    },
  });
}
