import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { createId } from './createId';
import { epochSeconds } from './customTypes';
import { InferSelectModel, InferInsertModel, sql } from 'drizzle-orm';

export const eventTable = sqliteTable(
  'event',
  {
    id: text('id')
      .notNull()
      .primaryKey()
      .$default(() => createId()),
    data: text('data').notNull(),
    queueSlug: text('queue_slug').notNull(),
    dateAddedUtc: epochSeconds('date_added_utc')
      .notNull()
      .default(sql`(unixepoch())`)
      .$default(() => new Date()),
    dateScheduledUtc: epochSeconds('date_scheduled_utc').notNull(),
    status: text('status', { enum: ['SCHEDULED', 'PROCESSING', 'SUCCEEDED', 'FAILED'] })
      .notNull()
      .default('SCHEDULED'),
  },
  (table) => ({
    dateScheduledUtcStatusIdx: index('event_date_scheduled_utc_status_idx').on(
      table.dateScheduledUtc,
      table.status
    ),
  })
);
export type EventInsertType = InferInsertModel<typeof eventTable>;
export type EventSelectType = InferSelectModel<typeof eventTable>;
