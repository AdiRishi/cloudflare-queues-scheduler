import { app } from './routes';

export type Env = {
  ENVIRONMENT: 'testing' | 'development' | 'production';
  __D1_BETA_DB: D1Database;
  DB: D1Database;
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.fetch(request, env, ctx);
  },
};
