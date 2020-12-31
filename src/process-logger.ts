import type { Logger, LogLevels } from 'npmlog';

/** Non-level methods of the logger object. */
type LogMethods = 'pause' | 'resume';

/**
 * A logger passed around to many npm utilities (pacote, arborist, &c).
 * By default, 'log' events are emitted on the `process` object.
 */
export type MinimalLogger = Pick<Logger, LogLevels> & Pick<Logger, LogMethods>;

/**
 * When the 'log' event originates from a non-level method
 * (e.g., `log.pause()`), arguments after the first are undefined.
 */
type ProcessLogListener = (
  level: LogLevels | LogMethods,
  prefix: string,
  message: string,
  ...args: unknown[]
) => void;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Process {
      emit(event: 'log', method: LogMethods): boolean;
      emit(
        event: 'log',
        level: LogLevels,
        prefix: string,
        message: string,
        ...args: unknown[]
      ): boolean;

      addListener(event: 'log', listener: ProcessLogListener): this;
      on(event: 'log', listener: ProcessLogListener): this;
      once(event: 'log', listener: ProcessLogListener): this;
      listeners(event: 'log'): ProcessLogListener[];
    }
  }
}

export const levels: ReadonlyArray<LogLevels> = [
  'silly',
  'verbose',
  'info',
  'timing',
  'http',
  'notice',
  'warn',
  'error',
  'silent',
] as const;

export function processLogger() {
  const logger = {} as MinimalLogger;

  for (const level of levels) {
    logger[level] = (prefix: string, message: string, ...args: unknown[]) => {
      process.emit('log', level, prefix, message, ...args);
    };
  }

  for (const method of ['pause', 'resume'] as const) {
    logger[method] = () => {
      process.emit('log', method);
    };
  }

  return logger;
}
