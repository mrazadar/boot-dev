// normalizeURL.ts

import { getURLsFromHTML } from "./parseHtml";

/**
 * Normalize a URL string by removing the protocol,
 * subdomain, and trailing slash
 * @param urlString - The URL string to normalize
 */
export const normalizeURL = (urlString: string) => {
  // Parse the URL using Node.js URL object
  const url = new URL(urlString);

  // Extract hostname and pathname, removing trailing slash from pathname
  const normalizedPath = url.pathname.replace(/\/$/, "");

  // Return normalized URL as hostname + normalized pathname
  return `${url.hostname}${normalizedPath}`;
};

/**
 * Extract the URL HTML
 * Use fetch to fetch the webpage of the url
 * Set a User-Agent header (e.g. BootCrawler/1.0) to avoid being blocked by servers.
 * If the HTTP status code is an error-level code (400+), print an error and return
 * If the response content-type header is not text/html print an error and return
 * Otherwise, just print the HTML body as a string and be done
 */
export const getHtml = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "BootCrawler/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Error fetching ${url}: ${response.status} ${response.statusText}`
    );
  }

  if (response.headers.get("content-type") !== "text/html") {
    throw new Error(`Error fetching ${url}: content-type is not text/html`);
  }

  const html = await response.text();
  return html;
};

/**
 * Create a crawlPage function that uses recursion to traverse a website. Recursion is useful because we want to continue to crawl each URL we find on a page until we've crawled every page on the site. Here's my function signature:
async function crawlPage(
  baseURL: string,
  currentURL: string,
  pages: Record<string, number>,
);

currentURL is the current URL we're crawling.
baseURL is the root URL of the website we're crawling.
In the first call to crawlPage(), currentURL will just be a copy of the baseURL, but as we make further fetch requests to all the URLs we find on the baseURL, the currentURL value will change while the base stays the same.

The pages object will be used to keep track of the number of times we've seen each internal link. This function needs to always return an updated version of this object.

This is a good use case for default parameters:

function crawlPage(
  baseURL: string,
  currentURL: string = baseURL,
  pages: Record<string, number> = {},
);

Here's my pseudocode:

Make sure the currentURL is on the same domain as the baseURL. If it's not, just return the current pages. We don't want to crawl the entire internet, just the domain in question.
Get a normalized version of the currentURL.
If the pages object already has an entry for the normalized version of the current URL, just increment the count and return the current pages.
Otherwise, add an entry to the pages object for the normalized version of the current URL, and set the count to 1.
Get the HTML from the current URL using our getHTML function, and add a print statement so you can watch your crawler in real-time.
Assuming all went well with the fetch request in the new function, get all the URLs from the response body HTML.
Recursively crawl each URL you found on the page and update the pages to keep an aggregate count.
Finally, return the updated pages object.
IMPORTANT NOTE! Be careful testing this! Be sure to add print statements so you can see what your crawler is doing, and kill it with ctrl+c if it's stuck in a loop. If you make too many spammy requests to a website (including my blog) you could get your IP address blocked.
Call crawlPage in the main function instead of getHTML and log the returned pages.
Test your program by running it against a small site (10-50 pages, like my blog).
When you're satisfied that everything is working, you can move on.
 */

export const crawlPage = async (
  baseURL: string,
  currentURL: string = baseURL,
  pages: Record<string, number> = {}
) => {
  // make sure the currentURL is on the same domain as the baseURL
  const currentUrl = new URL(currentURL, baseURL);
  const baseUrl = new URL(baseURL);
  if (currentUrl.hostname !== baseUrl.hostname) {
    return pages;
  }

  const pageData = await getHtml(currentURL);
  console.log("Page Data - Start - currentURL: " + currentURL);
  console.log(pageData);
  console.log("Page Data - End ");
  const urls = getURLsFromHTML(pageData, baseURL);
  for (const url of urls) {
    pages[url] = pages[url] ? pages[url] + 1 : 1;
    await crawlPage(baseURL, url, pages);
  }
  return pages;
};
