import { scheduleAllPendingEvents } from './business-logic/schedule-events';
import { app } from './routes';

export type Env = {
  ENVIRONMENT: 'testing' | 'development' | 'production';
  __D1_BETA_DB: D1Database;
  DB: D1Database;
  OUTBOUND_QUEUE: Queue;
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.fetch(request, env, ctx);
  },

  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    await scheduleAllPendingEvents(env);
  },
};
