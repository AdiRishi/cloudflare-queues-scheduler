import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Env } from '..';
import { saveEvent } from '../db/data-layer';
import { createId } from '../db/createId';

export const v1Router = new Hono<{ Bindings: Env }>();

v1Router.post(
  '/event',
  zValidator(
    'json',
    z.object({
      data: z.record(z.unknown()),
      dataLocation: z.enum(['KV', 'R2']),
      queueIdentifier: z.string(),
      scheduleAt: z.coerce.date(),
    })
  ),
  async (c) => {
    const bodyData = c.req.valid('json');
    const eventId = createId();
    const event = await saveEvent(
      {
        id: eventId,
        dataKey: `${bodyData.queueIdentifier}:${eventId}`,
        dataLocation: bodyData.dataLocation,
        queueSlug: bodyData.queueIdentifier,
        dateScheduledUtc: bodyData.scheduleAt,
      },
      c.env
    );
    return c.json(event);
  }
);
