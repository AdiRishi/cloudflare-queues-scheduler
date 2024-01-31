import { Env } from '..';
import { bulkUpdateStatus, getEventsToBeScheduled } from '../db/data-layer';
import { chunkArray, groupBy } from '../utils/array';

export async function scheduleAllPendingEvents(env: Env) {
  const queuesBySlug = new Map<string, Queue>();
  queuesBySlug.set('OUTBOUND_QUEUE', env.OUTBOUND_QUEUE);

  for await (const events of getEventsToBeScheduled(env)) {
    const eventsByQueue = groupBy(events, (e) => e.queueSlug);
    for (const [queueSlug, queueEvents] of eventsByQueue) {
      const queue = queuesBySlug.get(queueSlug);
      if (!queue) {
        throw new Error(`Queue not found for slug: ${queueSlug}`);
      }
      const chunks = chunkArray(queueEvents, 100);
      for (const chunk of chunks) {
        await queue.sendBatch(
          chunk.map((e) => ({ body: JSON.parse(e.data) as unknown, contentType: 'json' }))
        );
        await bulkUpdateStatus(
          chunk.map((e) => e.id),
          'SUCCEEDED',
          env
        );
      }
    }
  }
}
