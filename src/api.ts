interface RunOptions {
  logger: typeof console.error
}

export function run ({ logger }: RunOptions): void {
  logger('Count those tree rings!')
}
