# pagination-window

Generates a bounded "window" into a list of items for pagination.

- truncate pages around the "current" page, presenting a fixed number of pages
- view framework agnostic (though designed around React)
- exposed as simple objects in an array which can be mapped over
- translation from API paging info, e.g. `offset` and `limit` fields

## Example

```javascript
import React from "react";
import getPaginationWindow from "pagination-window";

export default function PaginationControl({ offset, limit, total }) {
  return (
    <div>
      {getPaginationWindow({ offset, limit, total }).map((page) => {
        if (page.type === "ellipsis") {
          return <span key={page.key}>...</span>;
        }
        const link = !page.isDisabled
          ? `?offset=${page.offset}&limit=${limit}`
          : undefined;
        const border = page.isCurrent ? "1px solid black" : undefined;
        const style = { display: "inline-block", padding: "0.3em", border };
        return (
          <a key={page.key} href={link} style={style}>
            {page.type === "page"
              ? page.number
              : page.direction === "previous"
                ? "<<"
                : ">>"}
          </a>
        );
      })}
    </div>
  );
}
```

## API

A single function is exported from the library taking a single `config` object argument and returning an array of the various
pagination items.

```javascript
const config = { offset: 0, limit: 10, total: 20 };
getPaginationWindow(config);
// Result:
[
  {
    type: "navigation",
    key: "navigation-previous",
    isDisabled: true,
    direction: "previous",
    number: 1,
    offset: 0,
  },
  {
    type: "page",
    key: "page-1",
    isDisabled: false,
    isCurrent: true,
    number: 1,
    offset: 0,
  },
  {
    type: "page",
    key: "page-2",
    isDisabled: false,
    isCurrent: false,
    number: 2,
    offset: 10,
  },
  {
    type: "navigation",
    key: "navigation-next",
    direction: "next",
    isDisabled: false,
    number: 2,
    offset: 10,
  },
];
```

### Config

- offset {number} The position in the list around which to create the window.
- limit {number} The number of items displayed per page.
- total {number} The total number of items in the list.

### Pagination Item

Each object in the returned array is one of `Page`, `Navigation`, or `Ellipsis` types and has these common properties:

- type {string} The type of the pagination item (see examples for the specific value for each type).
- key {string} A key for uniquely identifying the pagination item within the current window (e.g. for React's `key` property).
- isDisabled {boolean} Whether the pagination item should rendered as disabled (e.g. due to having no destination).

`Page` and `Navigation` objects have the these extra properties:

- number {number} The page number linked to by this pagination item.
- offset {number} The API offset equivalent for the page linked to by this pagination item.

### Page Item

A pagination item for linking to a specific page.

- isCurrent {boolean} Whether the pagination item represents the currently selected page.

```javascript
{
  "type": "page",
  "key": "page-1",
  "isDisabled": false,
  "isCurrent": true,
  "number": 1,
  "offset": 0
}
```

### Navigation Item

A pagination item for linking to a page relative to the current page. These always appear as the first and last items.

- direction {string} The direction the pagination item navigates (e.g. `"previous"` or `"next"`).

```javascript
{
  type: "navigation",
  key: "navigation-previous",
  isDisabled: true,
  direction: "previous",
  number: 1,
  offset: 0,
}
```

### Ellipsis Item

A pagination item representing a discontinuity between pages. These appear once the total page count exceeds the window size.

```javascript
{
  type: "ellipsis",
  key: "ellipsis-back",
  isDisabled: true,
}
```
