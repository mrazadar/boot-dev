import { JSDOM } from "jsdom";

/**
 * Get the first h1 tag from the HTML string
 */
export const getH1FromHtml = (html: string) => {
  const dom = new JSDOM(html);
  const h1Tag = dom.window.document.querySelector("h1");
  return h1Tag ? h1Tag.textContent : "";
};

/**
 * Get the first paragraph tag from the HTML string
 * Look for main tag and then look for p tag inside it
 * if main doesn't exist find the first p tag
 */
export const getFirstParagraphFromHtml = (html: string) => {
  const dom = new JSDOM(html);
  const mainTag = dom.window.document.querySelector("main");
  const pTag = mainTag
    ? mainTag.querySelector("p")
    : dom.window.document.querySelector("p");
  return pTag ? pTag.textContent : "";
};

/**
 * function getURLsFromHTML(html: string, baseURL: string): string[];
 * html is an HTML string
 * baseURL is the root URL of the website we're crawling.
 * This will allow us to rewrite relative URLs into absolute URLs.
 * It returns an un-normalized list of all the URLs found
 * within the HTML, and an error if one occurs.
 * We need to extract both https://blog.boot.dev (from the link)
 * and /logo.png (from the image).
 */
export const getURLsFromHTML = (html: string, baseURL: string): string[] => {
  const dom = new JSDOM(html);
  const links = dom.window.document.querySelectorAll("a");
  const urls = [];
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const href = link.getAttribute("href");

    // Extract hostname and pathname, removing trailing slash from pathname
    if (href && href.startsWith("/")) {
      const url = new URL(href, baseURL);
      urls.push(url.toString());
    } else if (href) {
      const url = new URL(href);
      const normalizedPath = url.pathname.replace(/\/$/, "");
      urls.push(baseURL + normalizedPath);
    }
  }
  return urls;
};

export const getImagesFromHTML = (html: string, baseURL: string): string[] => {
  const dom = new JSDOM(html);
  const images = dom.window.document.querySelectorAll("img");
  const urls = [];
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const src = image.getAttribute("src");

    // extract the image URL from the src attribute
    // check if relative URL
    // if relative URL, add baseURL to it
    // if absolute URL, return it
    if (src && src.startsWith("/")) {
      const url = new URL(src, baseURL);
      urls.push(url.toString());
      // if absolute URL, return it
    } else if (src) {
      urls.push(src);
    }
  }
  return urls;
};

/**
 * extractPageData
 * extracts the basic page data and html tags in a structured format
 */
export const extractPageData = (html: string, baseURL: string) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const url = baseURL;
  const h1 = getH1FromHtml(html);
  const firstParagraph = getFirstParagraphFromHtml(html);
  const imageURLs = getImagesFromHTML(html, baseURL);
  const outgoingLinks = getURLsFromHTML(html, baseURL);
  return {
    url,
    h1,
    first_paragraph: firstParagraph,
    outgoing_links: outgoingLinks,
    image_urls: imageURLs,
  };
};
