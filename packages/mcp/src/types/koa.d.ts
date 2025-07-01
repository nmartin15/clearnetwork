import * as Koa from 'koa';

declare module 'koa' {
  interface Context {
    state: {
      user?: any;
      requestId?: string;
    };
    request: Koa.Request & {
      body?: any;
    };
  }
}

export {};
