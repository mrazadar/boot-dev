import { argv } from "process";
import { crawlPage } from "./crawl";

/**
 * npm run start "https://wikipedia.org" | grep "<body"
 */
async function main() {
  // expect only one command line argument

  if (argv.length < 3) {
    console.log(`Usage: npm run start "https://wikipedia.org" | grep "<body"`);
    throw new Error("No URL provided");
  }

  if (argv.length > 3) {
    console.log(`Usage: npm run start "https://wikipedia.org" | grep "<body"`);
    throw new Error("Too many arguments provided");
  }

  const url = argv[2];

  console.log("Crawler is starting at " + url);

  const html = await crawlPage(url);
  console.log("HTML is fetched successfully");

  console.log(html);

  process.exit(0);
}

main();
