// Refreshes the vendored copy of Bahunya (https://github.com/kimeiga/bahunya).
// Bahunya isn't published to npm and npm refuses git dependencies by default,
// so the built stylesheet is pinned to a commit and committed to this repo.
//
// Usage: npm run update-bahunya [-- <commit-sha>]
import { writeFile } from "node:fs/promises";

const repo = "kimeiga/bahunya";
const target = new URL("../scss/vendor/_bahunya.css", import.meta.url);

async function fetchOk(url) {
  const res = await fetch(url, { headers: { "User-Agent": "a2g-update-bahunya" } });
  if (!res.ok) {
    throw new Error(`${url}: ${res.status} ${res.statusText}`);
  }
  return res;
}

const sha =
  process.argv[2] ||
  (await (await fetchOk(`https://api.github.com/repos/${repo}/commits/HEAD`)).json()).sha;
const pkg = await (await fetchOk(`https://cdn.jsdelivr.net/gh/${repo}@${sha}/package.json`)).json();
const css = await (await fetchOk(`https://cdn.jsdelivr.net/gh/${repo}@${sha}/dist/bahunya.css`)).text();

const header =
  `/*! Bahunya ${pkg.version} (${repo}@${sha.slice(0, 7)}) | ${pkg.license} License | https://github.com/${repo}\n` +
  "   Vendored from dist/bahunya.css. Refresh with `npm run update-bahunya`. */\n";

await writeFile(target, header + css);
console.log(`Updated scss/vendor/_bahunya.css to Bahunya ${pkg.version} @ ${sha.slice(0, 7)}`);
