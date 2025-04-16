export class Logger {
  static info(message: string, data?: Record<string, any>): void {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
  }

  static warn(message: string, data?: Record<string, any>): void {
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '');
  }

  static error(message: string, error: Error): void {
    console.error(`[ERROR] ${message}`, {
      error: error.message,
      stack: error.stack
    });
  }
} 