import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Env } from '..';
import { saveEvent } from '../db/data-layer';
import { createId } from '../db/createId';

export const v1Router = new Hono<{ Bindings: Env }>();

const v1EventSchema = z.object({
  data: z.record(z.unknown()),
  queueIdentifier: z.string(),
  scheduleAt: z.coerce.date(),
});

v1Router.post('/event', zValidator('json', v1EventSchema), async (c) => {
  const bodyData = c.req.valid('json');
  const eventId = createId();
  const event = await saveEvent(
    {
      id: eventId,
      data: JSON.stringify(bodyData.data),
      queueSlug: bodyData.queueIdentifier,
      dateScheduledUtc: bodyData.scheduleAt,
    },
    c.env
  );
  return c.json(event);
});

v1Router.post(
  '/event/batch',
  zValidator('json', z.object({ events: z.array(v1EventSchema).max(512) })),
  async (c) => {
    const bodyData = c.req.valid('json');
    const eventPromises = bodyData.events.map(async (event) => {
      const eventId = createId();
      return await saveEvent(
        {
          id: eventId,
          data: JSON.stringify(event.data),
          queueSlug: event.queueIdentifier,
          dateScheduledUtc: event.scheduleAt,
        },
        c.env
      );
    });
    const settledEvents = await Promise.allSettled(eventPromises);
    const events = settledEvents.map((settledEvent) => {
      if (settledEvent.status === 'rejected') {
        console.log(settledEvent.reason);
        return { error: settledEvent.reason as unknown };
      }
      return settledEvent.value;
    });
    return c.json({ events });
  }
);
