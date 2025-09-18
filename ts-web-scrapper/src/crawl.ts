// normalizeURL.ts
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
