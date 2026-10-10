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

const { JSDOM } = require("jsdom");
const { promisify } = require("util");
const { imageSizeFromFile: sizeOf } = require("image-size/fromFile");
const blurryPlaceholder = require("./blurry-placeholder");
const srcset = require("./srcset");
const path = require("path");
const sourcePath = require("./source-path");

/**
 * Sets `width` and `height` on each image, adds blurry placeholder
 * and generates a srcset if none present.
 * Note, that the static `sizes` string would need to change for a different
 * blog layout.
 */

const processImage = async (img, outputPath) => {
  let src = img.getAttribute("src");
  if (/^(https?\:\/\/|\/\/)/i.test(src)) {
    return;
  }
  if (/^\.+\//.test(src)) {
    // resolve relative URL
    src =
      "/" +
      path.relative("./_site/", path.resolve(path.dirname(outputPath), src));
    if (path.sep == "\\") {
      src = src.replace(/\\/g, "/");
    }
  }
  let dimensions;
  try {
    dimensions = await sizeOf(sourcePath(src));
  } catch (e) {
    console.warn(e.message, src);
    return;
  }
  if (!img.getAttribute("width")) {
    img.setAttribute("width", dimensions.width);
    img.setAttribute("height", dimensions.height);
  }
  const inputType = dimensions.type;
  if (inputType == "svg" || inputType == "gif") {
    return;
  }
  // When the input is a PNG, we keep the fallback image a PNG because JPEG does
  // not support transparency. However, we still optimize to AVIF/WEBP in a lossy
  // fashion. It may be worth adding a feature to opt-out of lossy optimization.
  const fallbackType = inputType == "png" ? "png" : "jpeg";
  // EXIF orientations 5-8 rotate by 90°, and the resized copies are rotated.
  const sourceWidth =
    dimensions.orientation >= 5 ? dimensions.height : dimensions.width;
  img.setAttribute("decoding", "async");
  img.setAttribute("loading", "lazy");
  img.setAttribute(
    "style",
    `background-size:cover;` +
      `background-image:url("${await blurryPlaceholder(src)}")`
  );
  const doc = img.ownerDocument;
  const picture = doc.createElement("picture");
  const avif = doc.createElement("source");
  const webp = doc.createElement("source");
  const jpeg = doc.createElement("source");
  await setSrcset(avif, src, "avif", sourceWidth);
  avif.setAttribute("type", "image/avif");
  await setSrcset(webp, src, "webp", sourceWidth);
  webp.setAttribute("type", "image/webp");
  const fallback = await setSrcset(jpeg, src, fallbackType, sourceWidth);
  jpeg.setAttribute("type", `image/${fallbackType}`);
  picture.appendChild(avif);
  picture.appendChild(webp);
  picture.appendChild(jpeg);
  img.parentElement.replaceChild(picture, img);
  picture.appendChild(img);
  img.setAttribute("src", fallback);
};

async function setSrcset(img, src, format, sourceWidth) {
  const setInfo = await srcset(src, format, sourceWidth);
  img.setAttribute("srcset", setInfo.srcset);
  img.setAttribute(
    "sizes",
    img.getAttribute("align")
      ? "(max-width: 608px) 50vw, 187px"
      : "(max-width: 608px) 100vw, 608px"
  );
  return setInfo.fallback;
}

const dimImages = async (rawContent, outputPath) => {
  let content = rawContent;

  if (outputPath && outputPath.endsWith(".html")) {
    const dom = new JSDOM(content);
    const images = [...dom.window.document.querySelectorAll("img")];

    if (images.length > 0) {
      await Promise.all(images.map((i) => processImage(i, outputPath)));
      content = dom.serialize();
    }
  }

  return content;
};

module.exports = {
  initArguments: {},
  configFunction: async (eleventyConfig, pluginOptions = {}) => {
    eleventyConfig.addTransform("imgDim", dimImages);
  },
};
