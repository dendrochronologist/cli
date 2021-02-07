declare module 'yargs/helpers' {
  /** Platform-resilient (Node.js, Electron) process.argv.slice(2) */
  export function hideBin(argv: string[]): string[];
}
