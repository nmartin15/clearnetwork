declare module 'pino' {
  interface LoggerOptions {
    name?: string;
    level?: string;
    prettyPrint?: boolean | object;
  }

  interface Logger {
    info: (obj: object, msg?: string, ...args: any[]) => void;
    error: (obj: object, msg?: string, ...args: any[]) => void;
    warn: (obj: object, msg?: string, ...args: any[]) => void;
    debug: (obj: object, msg?: string, ...args: any[]) => void;
    trace: (obj: object, msg?: string, ...args: any[]) => void;
    fatal: (obj: object, msg?: string, ...args: any[]) => void;
    child(bindings: object): Logger;
  }

  function pino(options?: LoggerOptions): Logger;
  function pino(
    options: LoggerOptions,
    stream: NodeJS.WritableStream
  ): Logger;

  export = pino;
}
