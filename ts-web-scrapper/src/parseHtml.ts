/**
 * Extract the first h1 tag from the HTML string
 */
export const getH1FromHtml = (html: string) => {
  const h1Tag = html.match(/<h1>(.*?)<\/h1>/);
  return h1Tag ? h1Tag[1] : null;
};
