# Allergic to Gardening blog

Based on [eleventy-high-performance-blog](https://github.com/google/eleventy-high-performance-blog) and modified and tweaked to suit. Why? Because it's one of the few that hammer the accessibility side of things, and that's massively important to me.

![Screenshot showing that the site achieves 100 points on Lighthouse by default](https://cdn.glitch.com/db98564e-04da-47bf-a3d6-70803c3d0fe7%2FScreen%20Shot%202020-09-04%20at%2012.07.27.png?v=1599214260591)

## Notes for myself on building

### 1. Clone the repository

```
git clone https://github.com/blades/Allergic2Gardening/
```

### 2. Navigate to the directory

```
cd Allergic2Gardening
```

### 3. Install dependencies

```
npm install
```

### 4. Build 

```
npm run build
```

## Customize to do

- Update the favicons in 'img/favicon/'.
- For a simple color override, adjust these CSS variables at the top of `css/main.css`.

```css
:root {
  --primary: #7cc442;
  --primary-dark: #4c7927;
}
```
- Update css font sizes because they're so damned big
- Add search page link
- Tidy up end of blog entry content

## Added functionality

- Search facility based on [elasticlunr](https://www.belter.io/eleventy-search/)
- eleventy-plugin-embed-twitter
- eleventy-plugin-embed-instagram

## Features

The following is basically what's on the source that it was all based on.

### Performance outcomes

- Perfect score in applicable lighthouse audits (including accessibility).
- Single HTTP request to [First Contentful Paint](https://web.dev/first-contentful-paint/).
- Very optimized [Largest Contentful Paint](https://web.dev/lcp/) (score depends on image usage, but images are optimized).
- 0 [Cumulative Layout Shift](https://web.dev/cls/).
- ~0 [First Input Delay](https://web.dev/fid/).

### Performance optimizations

#### Images

- Generates multiple sizes of each image and uses them in **`srcset`**.
- Generates a **blurry placeholder** for each image (without adding an HTML element or using JS).
- Transcodes images to [AVIF](<https://en.wikipedia.org/wiki/AV1#AV1_Image_File_Format_(AVIF)>) and [webp](https://developers.google.com/speed/webp) and generates `picture` element.
- Transcodes GIFs to muted looping autoplaying MP4 videos for greatly reduced file size.
- **Lazy loads** images (using [native `loading=lazy`](https://web.dev/native-lazy-loading/)).
- **Async decodes** images (using `decoding=async`).
- **Lazy layout** of images and placeholders using [`content-visibility: auto`](https://web.dev/content-visibility/#skipping-rendering-work-with-content-visibility).
- **Avoids CLS impact** of images by inferring and providing width and height (Supported in Chrome, Firefox and Safari 14+).
- Downloads remote images and stores/serves them locally.
- Immutable URLs.

#### CSS

- Defaults to the compact "classless" [Bahunya CSS framework](https://kimeiga.github.io/bahunya/).
- Inlines CSS.
- Dead-code-eliminates / tree-shakes / purges (pick your favorite word) unused CSS on a per-page basis with [PurgeCSS](https://purgecss.com/).
- Minified CSS with [csso](https://www.npmjs.com/package/csso).

#### Miscellaneous

- Immutable URLs for JS.
- Sets immutable caching headers for images, fonts, and JS (CSS is inlined). Currently implements for Netlify `_headers` file.
- Minifies HTML and optimizes it for compression. Uses [html-minifier](https://www.npmjs.com/package/html-minifier) with aggressive options.
- Uses [rollup](https://rollupjs.org/) to bundle JS and minifies it with [terser](https://terser.org/).
- Prefetches same-origin navigations when a navigation is likely.
- If an AMP files is present, [optimizes it](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/optimize_amp/).

#### Fonts

- Serves fonts from same origin.
- Makes fonts `display:optional`.

#### Analytics

- Supports locally serving Google Analytics's JS and proxying it's hit requests to a Netlify proxy (other proxies could be easily added).
- Supports sending [Core Web Vitals](https://web.dev/vitals/) metrics to Google Analytics as [events](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics).
- Support for noscript hit requests.
- Avoids blocking onload on analytics requests.
- To turn this on, specify `googleAnalyticsId` in `metadata.json`. (Note, that this is not compatible with the not-yet-commonly used version 4 of Google Analytics.)

### DX features

- Uses 🚨 as favicon during local development.
- Supports a range of default tests.
- Runs build and tests on `git push`.
- Sourcemap generated for JS.

### SEO & Social

- Share button preferring `navigator.share()` and falling back to Twitter. Using OS-like share-icon.
- Support for OGP metadata.
- Support for Twitter metadata.
- Support for schema.org JSON-LD.
- Sitemap.xml generation.

### Largely useless glitter

- Read time estimate.
- Animated scroll progress bar…
- …with an optimized implementation that should never cause a layout.

### Security

Generates a strong CSP for the base template.

- Default-src is self.
- Disallows plugins.
- Generates hash based CSP for the JS used on the site.
- To extend the CSP with new rules, see [CSP.js](https://github.com/google/eleventy-high-performance-blog/blob/main/_data/csp.js#L22)

### Build performance

- Downloaded remote images, and generated sizes are cached in the local filesystem…
- …and SHOULD be committed to git.
- `.persistimages.sh` helps with this.
