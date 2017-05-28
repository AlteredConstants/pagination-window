import {
  createPreviousNavigationItem,
  createNextNavigationItem,
  createEllipsisItem,
  createPageItem,
  Window,
} from "./createItem";

const first = 1;

function rangeMap<T>(func: (i: number) => T, start: number, end: number): T[] {
  let i = start;
  const result = [];
  while (i <= end) {
    result.push(func(i));
    i += 1;
  }
  return result;
}

function getWindowBounds(current: number, last: number): [number, number] {
  const windowBuffer = 3;
  const safeCurrent = Math.min(Math.max(current, first), last);
  const windowFirst = safeCurrent - windowBuffer;
  const windowLast = safeCurrent + windowBuffer;
  if (windowFirst <= first) {
    return [
      first,
      // Plus one to take the place of front ellipsis.
      Math.min(windowLast + (first - windowFirst) + 1, last),
    ];
  }
  if (windowLast >= last) {
    return [
      // Minus one to take the place of back ellipsis.
      Math.max(windowFirst - (windowLast - last) - 1, first),
      last,
    ];
  }
  return [windowFirst, windowLast];
}

export default function getWindow(
  limit: number,
  current: number,
  last: number,
): Window {
  const previous = createPreviousNavigationItem(limit, current);
  const next = createNextNavigationItem(limit, current, last);
  const page = (number: number) => createPageItem(limit, current, number);
  const ellipsis = createEllipsisItem;
  if (first === last) {
    return [previous, page(first), next];
  }
  const [windowFirst, windowLast] = getWindowBounds(current, last);
  return [
    previous,
    ...(windowFirst > first
      ? [page(first), ellipsis("front")]
      : [page(windowFirst)]),
    ...rangeMap(page, windowFirst + 1, windowLast - 1),
    ...(windowLast < last
      ? [ellipsis("back"), page(last)]
      : [page(windowLast)]),
    next,
  ];
}
