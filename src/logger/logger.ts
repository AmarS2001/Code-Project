type LogLevel = "info" | "warn" | "error" | "debug";

interface LogOptions {
    message?: string;
    data?: unknown;
    context?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message?: string;
    data?: unknown;
    context?: string;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}

// ANSI color codes
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
};

const levelColors: Record<LogLevel, string> = {
    info: colors.cyan,
    warn: colors.yellow,
    error: colors.red,
    debug: colors.magenta,
};

const levelLabels: Record<LogLevel, string> = {
    info: "INFO",
    warn: "WARN",
    error: "ERROR",
    debug: "DEBUG",
};

class Logger {
    private jsonOutput: boolean = false;

    /**
     * Set JSON output mode
     */
    setJsonOutput(enabled: boolean): void {
        this.jsonOutput = enabled;
    }

    /**
     * Format timestamp
     */
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    /**
     * Create log entry object
     */
    private createLogEntry(
        level: LogLevel,
        options: LogOptions
    ): LogEntry {
        const entry: LogEntry = {
            timestamp: this.getTimestamp(),
            level,
        };

        if (options.message) {
            entry.message = options.message;
        }

        if (options.data !== undefined) {
            entry.data = options.data;
        }

        if (options.context) {
            entry.context = options.context;
        }

        if (options.error) {
            entry.error = {
                name: options.error?.name ?? 'Error',
                message: options.error?.message ?? String(options.error),
                stack: options.error?.stack,
            };
        }

        return entry;
    }

    /**
     * Format log entry as colored string
     */
    private formatColored(entry: LogEntry): string {
        const color = levelColors[entry.level];
        const levelLabel = levelLabels[entry.level];
        const reset = colors.reset;

        let output = `${colors.dim}[${entry.timestamp}]${reset} ${color}[${levelLabel}]${reset}`;

        if (entry.context) {
            output += ` ${colors.bright}${colors.blue}<${entry.context}>${reset}`;
        }

        if (entry.message) {
            output += ` ${entry.message}`;
        }

        if (entry.error) {
            output += ` ${colors.red}${entry.error.name}: ${entry.error.message}${reset}`;
            if (entry.error.stack) {
                output += `\n${colors.dim}${entry.error.stack}${reset}`;
            }
        }

        if (entry.data !== undefined) {
            const dataStr = typeof entry.data === "object"
                ? JSON.stringify(entry.data, null, 2)
                : String(entry.data);
            output += `\n${colors.dim}Data: ${dataStr}${reset}`;
        }

        return output;
    }

    /**
     * Format log entry as JSON string
     */
    private formatJson(entry: LogEntry): string {
        return JSON.stringify(entry, null, 2);
    }

    /**
     * Internal log method
     */
    private log(level: LogLevel, options: LogOptions): void {
        const entry = this.createLogEntry(level, options);
        const output = this.jsonOutput
            ? this.formatJson(entry)
            : this.formatColored(entry);
        console.log(output);
    }

    /**
     * Log info message
     */
    info(options: LogOptions): void;
    info(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { message, data }: { message: string; data?: any },
        context?: string,
        error?: Error
    ): void;
    info(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        optionsOrMessage: any,
        context?: string,
        error?: Error
    ): void {
        if (optionsOrMessage && typeof optionsOrMessage === "object" && "message" in optionsOrMessage && typeof optionsOrMessage.message === "string" && !("error" in optionsOrMessage)) {
            // Called with {message, data}, context, error
            this.log("info", {
                message: optionsOrMessage.message,
                data: optionsOrMessage.data,
                context,
                error,
            });
        } else {
            // Called with LogOptions object
            this.log("info", optionsOrMessage as LogOptions);
        }
    }

    /**
     * Log warning message
     */
    warn(options: LogOptions): void;
    warn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { message, data }: { message: string; data?: any },
        context?: string,
        error?: Error
    ): void;
    warn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        optionsOrMessage: any,
        context?: string,
        error?: Error
    ): void {
        if (optionsOrMessage && typeof optionsOrMessage === "object" && "message" in optionsOrMessage && typeof optionsOrMessage.message === "string" && !("error" in optionsOrMessage)) {
            // Called with {message, data}, context, error
            this.log("warn", {
                message: optionsOrMessage.message,
                data: optionsOrMessage.data,
                context,
                error,
            });
        } else {
            // Called with LogOptions object
            this.log("warn", optionsOrMessage as LogOptions);
        }
    }

    /**
     * Log error message
     */
    error(options: LogOptions): void;
    error(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { message, data }: { message: string; data?: any },
        context?: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error?: any
    ): void;
    error(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        optionsOrMessage: any,
        context?: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error?: any
    ): void {
        if (optionsOrMessage && typeof optionsOrMessage === "object" && "message" in optionsOrMessage && typeof optionsOrMessage.message === "string" && !("error" in optionsOrMessage)) {
            // Called with {message, data}, context, error
            this.log("error", {
                message: optionsOrMessage.message,
                data: optionsOrMessage.data,
                context,
                error,
            });
        } else {
            // Called with LogOptions object
            this.log("error", optionsOrMessage as LogOptions);
        }
    }

    /**
     * Log debug message
     */
    debug(options: LogOptions): void;
    debug(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { message, data }: { message: string; data?: any },
        context?: string,
        error?: Error
    ): void;
    debug(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        optionsOrMessage: any,
        context?: string,
        error?: Error
    ): void {
        if (optionsOrMessage && typeof optionsOrMessage === "object" && "message" in optionsOrMessage && typeof optionsOrMessage.message === "string" && !("error" in optionsOrMessage)) {
            // Called with {message, data}, context, error
            this.log("debug", {
                message: optionsOrMessage.message,
                data: optionsOrMessage.data,
                context,
                error,
            });
        } else {
            // Called with LogOptions object
            this.log("debug", optionsOrMessage as LogOptions);
        }
    }
}

// Export singleton instance
export const logger = new Logger();

// Export types and class for custom instances
export type { LogLevel, LogOptions, LogEntry };
export { Logger };
