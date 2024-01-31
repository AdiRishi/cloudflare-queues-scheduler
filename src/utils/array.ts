/**
 * Splits an array into chunks of the specified size.
 *
 * @param {Array<T>} array The array to split.
 * @param {number} chunkSize The size of each chunk.
 * @returns {Array<Array<T>>} An array of chunks.
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (chunkSize < 1) {
    throw new Error(`chunkSize must be greater than 0, got ${chunkSize}`);
  }
  const chunkedArray: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunkedArray.push(array.slice(i, i + chunkSize));
  }
  return chunkedArray;
}

/**
 * Groups an array of items by a callback.
 *
 * @param {Array<T>} array The array to group.
 * @param {GroupByCallback<T>} callback The callback to group by.
 * @returns {Map<string, T[]>} A map of groups.
 */
export function groupBy<T>(array: T[], callback: GroupByCallback<T>): Map<string, T[]> {
  const map = new Map<string, T[]>();

  for (const item of array) {
    const key = callback(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  }

  return map;
}
type GroupByCallback<T> = (item: T) => string;
