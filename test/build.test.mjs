// Checks the built site in _site/. Run after `npm run build`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, globSync } from "node:fs";

const metadata = JSON.parse(readFileSync("_data/metadata.json", "utf8"));
const read = (f) => readFileSync(`_site/${f}`, "utf8");

test("every page is a complete HTML document", () => {
  const pages = globSync("**/*.html", { cwd: "_site" });
  assert.ok(pages.length > 10, `only ${pages.length} pages built`);
  for (const page of pages) {
    assert.match(read(page), /<\/html>\s*$/i, `${page} is empty or cut short`);
  }
});

test("feeds and search index are valid", () => {
  const feed = JSON.parse(read("feed/feed.json"));
  assert.ok(feed.feed_url.startsWith(metadata.url + "/"), feed.feed_url);
  assert.ok(feed.items.length > 0);
  assert.doesNotMatch(read("feed/feed.xml"), /<email><\/email>/);
  JSON.parse(read("search-index.json"));
});
