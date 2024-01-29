import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { createId } from './createId';
import { InferSelectModel, InferInsertModel, sql } from 'drizzle-orm';

export const eventTable = sqliteTable(
  'event',
  {
    id: text('id')
      .notNull()
      .primaryKey()
      .$default(() => createId()),
    dataKey: text('data_key').notNull(),
    dataLocation: text('data_location', { enum: ['R2', 'KV'] }).notNull(),
    queueSlug: text('queue_slug').notNull(),
    dateAddedUtc: integer('date_added_utc')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    dateScheduledUtc: integer('date_scheduled_utc').notNull(),
    status: text('status', { enum: ['SCHEDULED', 'PROCESSING', 'SUCCEEDED', 'FAILED'] })
      .notNull()
      .default('SCHEDULED'),
  },
  (table) => ({
    dataKeyIdx: index('event_data_key_idx').on(table.dataKey),
    dateScheduledUtcStatusIdx: index('event_date_scheduled_utc_status_idx').on(
      table.dateScheduledUtc,
      table.status
    ),
  })
);
export type EventInsertType = InferInsertModel<typeof eventTable>;
export type EventSelectType = InferSelectModel<typeof eventTable>;
