import getWindow from "./getWindow";
import { Window } from "./createItem";

export interface Config {
  offset: number;
  limit: number;
  total: number;
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
  return getWindow(limit, current, last);
}
