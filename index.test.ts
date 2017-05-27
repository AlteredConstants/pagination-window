import getPaginationWindow from "./index";

function getConfig({ offset = 0, limit = 10, total = 50 }) {
  return { offset, limit, total };
}

describe("getPaginationWindow", () => {
  it("should return null if no config object is provided", () => {
    const windows = {
      nullInput: getPaginationWindow(<any>null),
      undefinedInput: getPaginationWindow(<any>undefined),
    };
    expect(windows).toEqual({ nullInput: null, undefinedInput: null });
  });

  it("should return null if config is not an object", () => {
    const window = getPaginationWindow(<any>"💥");
    expect(window).toBeNull();
  });

  it("should return null if offset, limit, or total are not numbers", () => {
    const windows = {
      offset: getPaginationWindow(<any>{ offset: "💥", limit: 10, total: 50 }),
      limit: getPaginationWindow(<any>{ offset: 0, limit: "💥", total: 50 }),
      total: getPaginationWindow(<any>{ offset: 0, limit: 10, total: "💥" }),
    };
    expect(windows).toEqual({ offset: null, limit: null, total: null });
  });

  it("should return null if offset, limit, or total are negative", () => {
    const windows = {
      offset: getPaginationWindow(<any>{ offset: -1, limit: 10, total: 50 }),
      limit: getPaginationWindow(<any>{ offset: 0, limit: -1, total: 50 }),
      total: getPaginationWindow(<any>{ offset: 0, limit: 10, total: -1 }),
    };
    expect(windows).toEqual({ offset: null, limit: null, total: null });
  });

  it("should return null if limit is zero", () => {
    const window = getPaginationWindow({ offset: 0, limit: 0, total: 50 });
    expect(window).toBeNull();
  });

  it("should create a window with 1 page if total is zero", () => {
    const window = getPaginationWindow({ offset: 0, limit: 10, total: 0 });
    expect(window).toMatchSnapshot();
  });

  it("should create a window without ellipses", () => {
    const window = getPaginationWindow({ offset: 40, limit: 10, total: 50 });
    expect(window).toMatchSnapshot();
  });

  it("should create a window with ellipses", () => {
    const window = getPaginationWindow({ offset: 40, limit: 10, total: 90 });
    expect(window).toMatchSnapshot();
  });

  it("should create only one page if total is zero", () => {
    const window = getPaginationWindow({ offset: 0, limit: 10, total: 0 });
    expect(window).toContainEqual(
      expect.objectContaining({ type: "page", number: 1 }),
    );
    expect(window).not.toContainEqual(
      expect.objectContaining({ type: "page", number: 2 }),
    );
  });

  it("should create only one page if total is less than the limit", () => {
    const window = getPaginationWindow({ offset: 0, limit: 10, total: 1 });
    expect(window).toContainEqual(
      expect.objectContaining({ type: "page", number: 1 }),
    );
    expect(window).not.toContainEqual(
      expect.objectContaining({ type: "page", number: 2 }),
    );
  });

  it("should not create a new page if total is on a limit boundary", () => {
    const window = getPaginationWindow({ offset: 0, limit: 10, total: 10 });
    expect(window).toContainEqual(
      expect.objectContaining({ type: "page", number: 1 }),
    );
    expect(window).not.toContainEqual(
      expect.objectContaining({ type: "page", number: 2 }),
    );
  });

  it("should create two pages if total is twice the limit", () => {
    const window = getPaginationWindow({ offset: 0, limit: 10, total: 20 });
    expect(window).toContainEqual(
      expect.objectContaining({ type: "page", number: 2 }),
    );
  });

  it("should disable 'previous' nav if offset is in the first page", () => {
    const window = getPaginationWindow({ offset: 0, limit: 10, total: 50 });
    expect(window[0]).toMatchObject({
      type: "navigation",
      direction: "previous",
      isDisabled: true,
    });
  });

  it("should disable 'next' nav if offset is in the last page", () => {
    const window = getPaginationWindow({ offset: 50, limit: 10, total: 50 });
    expect(window[window.length - 1]).toMatchObject({
      type: "navigation",
      direction: "next",
      isDisabled: true,
    });
  });

  it("should display only back ellipsis if offset is in the first half of the window", () => {
    const window = getPaginationWindow({ offset: 30, limit: 10, total: 90 });
    expect(window[2]).toMatchObject({ type: "page" });
    expect(window[window.length - 3]).toMatchObject({ type: "ellipsis" });
  });

  it("should display only front ellipsis if offset is in the second half of the window", () => {
    const window = getPaginationWindow({ offset: 60, limit: 10, total: 90 });
    expect(window[2]).toMatchObject({ type: "ellipsis" });
    expect(window[window.length - 3]).toMatchObject({ type: "page" });
  });

  it("should display both ellipses if offset is in the middle of the window", () => {
    const window = getPaginationWindow({ offset: 40, limit: 10, total: 90 });
    expect(window[2]).toMatchObject({ type: "ellipsis" });
    expect(window[window.length - 3]).toMatchObject({ type: "ellipsis" });
  });
});
