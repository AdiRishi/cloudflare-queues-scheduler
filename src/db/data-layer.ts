import { eq, sql, inArray } from 'drizzle-orm';
import { Env } from '..';
import { getDrizzleClient } from './client';
import { eventTable, EventInsertType, EventSelectType } from './schema';

export async function saveEvent(event: EventInsertType, env: Env): Promise<EventSelectType> {
  const db = getDrizzleClient(env);
  return db.insert(eventTable).values(event).returning().get();
}

export async function getEventById(id: string, env: Env): Promise<EventSelectType | undefined> {
  const db = getDrizzleClient(env);
  return await db.select().from(eventTable).where(eq(eventTable.id, id)).get();
}

export async function bulkUpdateStatus(
  ids: string[],
  newStatus: EventSelectType['status'],
  env: Env
) {
  const db = getDrizzleClient(env);
  await db
    .update(eventTable)
    .set({ status: newStatus })
    .where(inArray(eventTable.id, ids))
    .execute();
}

export async function* getEventsToBeScheduled(env: Env, batchSize = 1000, cutoffLength = 10_000) {
  const db = getDrizzleClient(env);
  const queryStatement = db
    .select({
      id: eventTable.id,
      data: eventTable.data,
      queueSlug: eventTable.queueSlug,
      dateScheduledUtc: eventTable.dateScheduledUtc,
    })
    .from(eventTable)
    .where(
      sql`${eventTable.dateScheduledUtc} <= unixepoch() AND ${eventTable.status} = 'SCHEDULED'`
    )
    .limit(sql.placeholder('batchSize'))
    .prepare();

  let totalEventsProcessed = 0;
  let noMoreEvents = false;

  do {
    const events = await queryStatement.all({ batchSize });
    totalEventsProcessed += events.length;
    noMoreEvents = events.length === 0;
    yield events;
  } while (totalEventsProcessed < cutoffLength && !noMoreEvents);
}
