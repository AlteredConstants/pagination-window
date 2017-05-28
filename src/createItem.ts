/** The base pagination item. */
export interface Item {
  /** The type of the pagination item. */
  type: string;
  /** A key for uniquely identifying the pagination item within the current window. */
  key: string;
  /** Whether the pagination item should rendered as disabled, e.g. due to having no destination. */
  isDisabled: boolean;
}

/** A pagination item representing a discontinuity between pages. */
export interface Ellipsis extends Item {
  /** The type of the pagination item. Always `ellipsis`. */
  type: "ellipsis";
  /** Whether the pagination item should rendered as disabled. Always `true`. */
  isDisabled: true;
}

/** A pagination item for linking to a page. */
export interface LinkableItem extends Item {
  /** The page number linked to by this pagination item. */
  number: number;
  /** The API offset equivalent for the page linked to by this pagination item. */
  offset: number;
}

/** A pagination item for linking to a specific page. */
export interface Page extends LinkableItem {
  /** The type of the pagination item. Always `page`. */
  type: "page";
  /** Whether the pagination item represents the currently selected page. */
  isCurrent: boolean;
}

/** A pagination item for linking to a page relative to the current page. */
export interface Navigation extends LinkableItem {
  /** The type of the pagination item. Always `navigation`. */
  type: "navigation";
  /** The direction the pagination item navigates, e.g. `previous` or `next`. */
  direction: string;
}

/** A window into a full page list centered around the current page. */
export type Window = (Page | Ellipsis | Navigation)[];

const first = 1;
const getOffset = (limit: number, number: number) => (number - 1) * limit;

export function createEllipsisItem(position: string): Ellipsis {
  return {
    type: "ellipsis",
    key: `ellipsis-${position}`,
    isDisabled: true,
  };
}

export function createPageItem(
  limit: number,
  current: number,
  number: number,
): Page {
  return {
    type: "page",
    key: `page-${number}`,
    isDisabled: false,
    isCurrent: number === current,
    number,
    offset: getOffset(limit, number),
  };
}

export function createPreviousNavigationItem(
  limit: number,
  current: number,
): Navigation {
  const previous = Math.max(current - 1, first);
  return {
    type: "navigation",
    key: "navigation-previous",
    isDisabled: current <= first,
    direction: "previous",
    number: previous,
    offset: getOffset(limit, previous),
  };
}

export function createNextNavigationItem(
  limit: number,
  current: number,
  last: number,
): Navigation {
  const next = Math.min(current + 1, last);
  return {
    type: "navigation",
    key: "navigation-next",
    direction: "next",
    isDisabled: current >= last,
    number: next,
    offset: getOffset(limit, next),
  };
}
