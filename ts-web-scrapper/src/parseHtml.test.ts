import { describe, it, expect } from "vitest";
import {
  getH1FromHtml,
  getFirstParagraphFromHtml,
  getURLsFromHTML,
  getImagesFromHTML,
  extractPageData,
} from "./parseHtml";

describe("getFirstParagraphFromHtml", () => {
  it("returns the first paragraph tag from the HTML string", () => {
    const html = `
      <main>
        <p>This is a paragraph.</p>
      </main>
    `;
    expect(getFirstParagraphFromHtml(html)).toBe("This is a paragraph.");
  });

  it("returns the first p tag from the HTML string", () => {
    const html = `
      <p>This is a paragraph.</p>
    `;
    expect(getFirstParagraphFromHtml(html)).toBe("This is a paragraph.");
  });

  it("returns an empty string if no paragraph tag is found", () => {
    const html = `
      <main>
        <h1>Hello World</h1>
      </main>
    `;
    expect(getFirstParagraphFromHtml(html)).toBe("");
  });

  it("returns an empty string if the HTML string is empty", () => {
    expect(getFirstParagraphFromHtml("")).toBe("");
  });
});

describe("getH1FromHtml", () => {
  it("returns the first h1 tag from the HTML string", () => {
    const html = `
      <h1>Hello World</h1>
      <p>This is a paragraph.</p>
    `;
    expect(getH1FromHtml(html)).toBe("Hello World");
  });

  it("returns an empty string if no h1 tag is found", () => {
    const html = `
      <p>This is a paragraph.</p>
    `;
    expect(getH1FromHtml(html)).toBe("");
  });

  it("returns an empty string if the HTML string is empty", () => {
    expect(getH1FromHtml("")).toBe("");
  });
});

describe("getURLsFromHTML", () => {
  it("returns an array of URLs from the HTML string", () => {
    const baseURL = "https://blog.boot.dev";
    const inputBody = `<html><body><a href="https://blog.boot.dev"><span>Boot.dev</span></a></body></html>`;

    const expected = ["https://blog.boot.dev"];
    expect(getURLsFromHTML(inputBody, baseURL)).toEqual(expected);
  });
});

describe("getImagesFromHTML", () => {
  it("returns an array of image URLs from the HTML string", () => {
    const inputURL = "https://blog.boot.dev";
    const inputBody = `<html><body><img src="/logo.png" alt="Logo"></body></html>`;

    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = ["https://blog.boot.dev/logo.png"];

    expect(actual).toEqual(expected);
  });

  it("returns an empty array if no image tags are found", () => {
    const inputURL = "https://blog.boot.dev";
    const inputBody = `<html><body><p>Hello World</p></body></html>`;

    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected: string[] = [];

    expect(actual).toEqual(expected);
  });

  it("returns an array of absolute image URLs", () => {
    const inputURL = "https://blog.boot.dev";
    const inputBody = `<html><body><img src="https://blog.boot.dev/logo.png" alt="Logo"></body></html>`;

    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = ["https://blog.boot.dev/logo.png"];

    expect(actual).toEqual(expected);
  });
});

describe("extractPageData", () => {
  it("extracts the basic page data and html tags in a structured format", () => {
    const baseUrl = "https://blog.boot.dev";
    const inputBody = `
      <html><body>
        <h1>Test Title</h1>
        <p>This is the first paragraph.</p>
        <a href="/link1">Link 1</a>
        <img src="/image1.jpg" alt="Image 1">
      </body></html>
    `;

    const actual = extractPageData(inputBody, baseUrl);
    const expected = {
      url: "https://blog.boot.dev",
      h1: "Test Title",
      first_paragraph: "This is the first paragraph.",
      outgoing_links: ["https://blog.boot.dev/link1"],
      image_urls: ["https://blog.boot.dev/image1.jpg"],
    };

    expect(actual).toEqual(expected);
  });
});
