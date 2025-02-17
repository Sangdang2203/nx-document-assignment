/* eslint-disable @typescript-eslint/no-explicit-any */
export const generateId = () => Date.now().toString();

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  // const aValue = a[orderBy];
  // const bValue = b[orderBy];

  // const aTime = aValue instanceof Date ? aValue.getTime() : aValue;
  // const bTime = bValue instanceof Date ? bValue.getTime() : bValue;

  // if (aTime < bTime) {
  //   return -1;
  // }

  // if (aTime > bTime) {
  //   return 1;
  // }

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = 'asc' | 'desc';

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | Date },
  b: { [key in Key]: number | string | Date }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
