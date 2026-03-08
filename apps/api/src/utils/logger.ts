/**
 * Lightweight structured logger for the document intelligence layer.
 * Wraps console with level, timestamp, and context fields.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

const CURRENT_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[CURRENT_LEVEL];
}

function format(level: LogLevel, module: string, message: string, data?: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    module,
    message,
    ...(data && { data }),
  };
  return JSON.stringify(entry);
}

export function createLogger(module: string) {
  return {
    debug: (msg: string, data?: Record<string, unknown>) => {
      if (shouldLog('debug')) console.debug(format('debug', module, msg, data));
    },
    info: (msg: string, data?: Record<string, unknown>) => {
      if (shouldLog('info')) console.log(format('info', module, msg, data));
    },
    warn: (msg: string, data?: Record<string, unknown>) => {
      if (shouldLog('warn')) console.warn(format('warn', module, msg, data));
    },
    error: (msg: string, data?: Record<string, unknown>) => {
      if (shouldLog('error')) console.error(format('error', module, msg, data));
    },
  };
}
