// normalizeURL.test.js
import { describe, it, expect } from "vitest";
import { normalizeURL } from "./crawl";

// Adjust path if needed

describe("normalizeURL", () => {
  it("removes https protocol and trailing slash", () => {
    expect(normalizeURL("https://blog.boot.dev/path/")).toBe(
      "blog.boot.dev/path"
    );
  });

  it("removes https protocol without trailing slash", () => {
    expect(normalizeURL("https://blog.boot.dev/path")).toBe(
      "blog.boot.dev/path"
    );
  });

  it("removes http protocol and trailing slash", () => {
    expect(normalizeURL("http://blog.boot.dev/path/")).toBe(
      "blog.boot.dev/path"
    );
  });

  it("removes http protocol without trailing slash", () => {
    expect(normalizeURL("http://blog.boot.dev/path")).toBe(
      "blog.boot.dev/path"
    );
  });

  it("handles root path with trailing slash", () => {
    expect(normalizeURL("https://blog.boot.dev/")).toBe("blog.boot.dev");
  });

  it("handles root path without trailing slash", () => {
    expect(normalizeURL("https://blog.boot.dev")).toBe("blog.boot.dev");
  });

  it("throws error for invalid URL", () => {
    expect(() => normalizeURL("not-a-url")).toThrow("Invalid URL");
  });

  it("handles subdomains correctly", () => {
    expect(normalizeURL("https://sub.blog.boot.dev/path/")).toBe(
      "sub.blog.boot.dev/path"
    );
  });

  it("handles multiple path segments", () => {
    expect(normalizeURL("https://blog.boot.dev/path/to/page/")).toBe(
      "blog.boot.dev/path/to/page"
    );
  });
});
