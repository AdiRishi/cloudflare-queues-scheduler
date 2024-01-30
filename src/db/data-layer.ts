import { eq } from 'drizzle-orm';
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
