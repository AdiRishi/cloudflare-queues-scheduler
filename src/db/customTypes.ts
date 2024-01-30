import { customType } from 'drizzle-orm/sqlite-core';

export const epochSeconds = customType<{ data: Date; driverData: number; default: true }>({
  dataType: () => 'integer',
  toDriver: (value) => Math.floor(value.getTime() / 1000),
  fromDriver: (value) => new Date(value * 1000),
});
