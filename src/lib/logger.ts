type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV !== "production";

function log(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, level, message, ...context };

  if (isDev) {
    const color = {
      debug: "\x1b[90m",
      info: "\x1b[36m",
      warn: "\x1b[33m",
      error: "\x1b[31m",
    }[level];
    console.log(`${color}[${level.toUpperCase()}]\x1b[0m ${message}`, context ?? "");
  } else {
    // In production, emit structured JSON for log aggregators
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => log("debug", message, context),
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext) => log("error", message, context),
};