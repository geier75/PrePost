/**
 * Production-Ready Logging System
 * Structured logging with levels, timestamps, and context
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

interface LogContext {
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private minLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
    this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.CRITICAL];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatLog(entry: LogEntry): string {
    if (this.isDevelopment) {
      // Pretty format for development
      return JSON.stringify(entry, null, 2);
    }
    // Single-line JSON for production (easier to parse)
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      };
    }

    const formatted = this.formatLog(entry);

    // Output to appropriate stream
    if (level === LogLevel.ERROR || level === LogLevel.CRITICAL) {
      console.error(formatted);
    } else if (level === LogLevel.WARN) {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  critical(message: string, error?: Error, context?: LogContext) {
    this.log(LogLevel.CRITICAL, message, context, error);
  }

  // Specialized logging methods
  apiRequest(method: string, path: string, context?: LogContext) {
    this.info(`API Request: ${method} ${path}`, context);
  }

  apiResponse(method: string, path: string, status: number, duration: number) {
    this.info(`API Response: ${method} ${path}`, {
      status,
      duration: `${duration}ms`,
    });
  }

  apiError(method: string, path: string, error: Error, context?: LogContext) {
    this.error(`API Error: ${method} ${path}`, error, context);
  }

  authAttempt(email: string, success: boolean, ip?: string) {
    this.info(`Auth Attempt: ${success ? 'SUCCESS' : 'FAILED'}`, {
      email: this.anonymizeEmail(email),
      ip: this.anonymizeIP(ip),
    });
  }

  securityEvent(event: string, context?: LogContext) {
    this.warn(`Security Event: ${event}`, context);
  }

  // Privacy helpers
  private anonymizeEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return '***';
    return `${local.substring(0, 2)}***@${domain}`;
  }

  private anonymizeIP(ip?: string): string {
    if (!ip) return 'unknown';
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.**`;
    }
    return '***';
  }
}

// Singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logError = (message: string, error?: Error, context?: LogContext) =>
  logger.error(message, error, context);
export const logCritical = (message: string, error?: Error, context?: LogContext) =>
  logger.critical(message, error, context);
