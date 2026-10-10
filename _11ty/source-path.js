const fs = require("fs");
const path = require("path");

/**
 * Resolves a site-absolute image URL (e.g. `/img/foo.jpg`) to a file to read.
 * Eleventy 3 copies passthrough files concurrently with rendering, so files
 * under `_site` may still be mid-copy when transforms run. Prefer the source
 * file and only fall back to `_site` for files generated during the build
 * (e.g. remote images downloaded by eleventy-plugin-local-images).
 */
module.exports = function sourcePath(src) {
  const source = path.join(".", src);
  return fs.existsSync(source) ? source : path.join("_site", src);
};
