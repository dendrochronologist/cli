declare module 'yargs/helpers' {
  /** Platform-resilient (Node.js, Electron) process.argv.slice(2) */
  declare function hideBin(argv: string[]): string[];
}
