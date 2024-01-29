import { init, getConstants } from '@paralleldrive/cuid2';

export const createId = init({ length: getConstants().bigLength });
