import { Env } from '..';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/d1';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

let drizzleClient: DrizzleD1Database<typeof completeSchema>;

const completeSchema = {
  ...schema,
};

export function getDrizzleClient(env: Env): DrizzleD1Database<typeof completeSchema> {
  if (!drizzleClient) {
    // Do not make the client more than once when the worker is in memory
    drizzleClient = drizzle(env.ENVIRONMENT === 'testing' ? env.__D1_BETA_DB : env.DB, {
      schema: completeSchema,
    });
  }
  return drizzleClient;
}
