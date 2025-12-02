import getWindow from "./getWindow";
import { Window } from "./createItem";

/** The configuration for generating a pagination window. */
export interface Config {
  /** The position in the list around which to create the window. */
  offset: number;
  /** The number of items displayed per page. */
  limit: number;
  /** The total number of items in the list. */
  total: number;
}

function validateConfig(config: Config): Config | false {
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
    total < 0 ||
    offset >= total
  ) {
    return false;
  }
  return config;
}

/**
 * Generates a bounded window into a list of items for pagination.
 * @param config The configuration for generating a pagination window.
 */
export default function getPaginationWindow(config: Config): Window | null {
  const result = validateConfig(config);
  if (!result) {
    return null;
  }
  const { offset, limit, total } = result;
  const last = Math.max(Math.ceil(total / limit), 1);
  const current = Math.floor(offset / limit) + 1;
  return getWindow(limit, current, last);
}
