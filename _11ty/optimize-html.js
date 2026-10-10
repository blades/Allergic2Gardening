/**
 * Copyright (c) 2020 Google Inc
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const htmlnano = require('htmlnano');
const htmlnanoOptions = {
  removeEmptyAttributes: false,
  collapseWhitespace: 'conservative',
  collapseAttributeWhitespace: true,
  deduplicateAttributeValues: true,
  removeComments: 'safe',
  removeAttributeQuotes: true,
  collapseBooleanAttributes: true,
  // CSS is already minified by csso in purifyCss; inline SVGs are hand-written.
  minifyCss: false,
  minifySvg: false,
};
const postHtmlOptions = {
  sync: true,
  lowerCaseTags: true,
  quoteAllAttributes: false,
};
const safePreset = require('htmlnano').presets.safe;
const PurgeCSS = require("purgecss").PurgeCSS;
const csso = require("csso");

/**
 * Inlines the CSS.
 * Makes font display display-optional
 * Minifies and optimizes the JS
 * Optimizes HTML
 */

const purifyCss = async (rawContent, outputPath) => {
  let content = rawContent;
  if (
    outputPath &&
    outputPath.endsWith(".html")
  ) {
    let before = require("fs").readFileSync("css/main.css", {
      encoding: "utf-8",
    });

    before = before.replace(
      /@font-face {/g,
      "@font-face {font-display:optional;"
    );

    const purged = await new PurgeCSS().purge({
      content: [
        {
          raw: rawContent,
          extension: "html",
        },
      ],
      css: [
        {
          raw: before,
        },
      ],
      // Season classes are added by src/main.js at runtime.
      safelist: ['::-webkit-scrollbar-thumb', 'winter', 'spring', 'summer', 'autumn'],
      fontFace: true,
      variables: true,
    });

    const after = csso.minify(purged[0].css).css;
    //console.log("CSS reduction", before.length - after.length);

    content = content.replace("</head>", `<style>${after}</style></head>`);
  }
  return content;
};

// Errors propagate so a minify failure fails the build instead of writing an
// empty page.
const minifyHtml = async (content, outputPath) => {
  if (outputPath && outputPath.endsWith(".html")) {
    return (await htmlnano.process(content, htmlnanoOptions, safePreset)).html;
  }
  return content;
};

module.exports = {
  initArguments: {},
  configFunction: async (eleventyConfig, pluginOptions = {}) => {
    eleventyConfig.addTransform("purifyCss", purifyCss);
    eleventyConfig.addTransform("minifyHtml", minifyHtml);
  }
};
