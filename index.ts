export interface Item {
  type: string;
  key: string;
  isDisabled: boolean;
  isCurrent: boolean;
}

export interface PageNumber {
  number: number;
  offset: number;
}

export interface Ellipsis extends Item {
  type: "ellipsis";
  isDisabled: true;
  isCurrent: false;
}

export interface Page extends Item, PageNumber {
  type: "page";
}

export interface Navigation extends Item, PageNumber {
  type: "navigation";
  direction: string;
  isCurrent: false;
}

export interface Config {
  offset: number;
  limit: number;
  total: number;
}

function range(start: number, end: number): number[] {
  let i = start;
  const result = [];
  while (i <= end) {
    result.push(i);
    i += 1;
  }
  return result;
}

function getWindowBounds(current: number, last: number): [number, number] {
  const first = 1;
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

function getWindow(current: number, last: number) {
  const first = 1;
  const [windowFirst, windowLast] = getWindowBounds(current, last);
  if (windowFirst === first && windowLast === last) {
    // There are fewer pages than a full window so no ellipses needed.
    return range(windowFirst, windowLast);
  }
  return [
    ...(windowFirst > first ? [first, "ellipsis-front"] : [windowFirst]),
    ...range(windowFirst + 1, windowLast - 1),
    ...(windowLast < last ? ["ellipsis-back", last] : [windowLast]),
  ];
}

type ValidatedConfig = Config | false;
function validateConfig(config: Config): ValidatedConfig {
  if (!config || typeof config !== "object") {
    return false;
  }
  const { offset, limit, total } = config;
  if (
    typeof offset !== "number" ||
    typeof limit !== "number" ||
    typeof total !== "number" ||
    offset < 0 ||
    limit < 1 ||
    total < 0
  ) {
    return false;
  }
  return config;
}

export type Window = (Page | Ellipsis | Navigation)[];
export default function getPaginationWindow(config: Config): Window | null {
  const result = validateConfig(config);
  if (!result) {
    return null;
  }
  const { offset, limit, total } = result;
  const first = 1;
  const last = Math.max(Math.ceil(total / limit), 1);
  const current = Math.floor(offset / limit) + 1;
  const previous = Math.max(current - 1, first);
  const next = Math.min(current + 1, last);
  const getOffset = (number: number) => (number - 1) * limit;
  return [
    {
      type: "navigation",
      key: "navigation-previous",
      isDisabled: current <= first,
      isCurrent: false,
      direction: "previous",
      number: previous,
      offset: getOffset(previous),
    },
    ...getWindow(current, last).map((number): Page | Ellipsis => {
      if (typeof number === "string") {
        return {
          type: "ellipsis",
          key: number,
          isDisabled: true,
          isCurrent: false,
        };
      }
      return {
        type: "page",
        key: `page-${number}`,
        isDisabled: false,
        isCurrent: number === current,
        number,
        offset: getOffset(number),
      };
    }),
    {
      type: "navigation",
      key: "navigation-next",
      direction: "next",
      isDisabled: current >= last,
      isCurrent: false,
      number: next,
      offset: getOffset(next),
    },
  ];
}
