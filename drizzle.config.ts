import type { Config } from 'drizzle-kit';
export default {
  schema: './src/db/schema.ts',
  out: './d1_migrations',
  breakpoints: true,
  driver: 'd1',
  dbCredentials: {
    dbName: 'cloudflare-queues-scheduler-db',
    wranglerConfigPath: '/Users/arishi/personal/cloudflare-queues-scheduler/wrangler.toml',
  },
} satisfies Config;
