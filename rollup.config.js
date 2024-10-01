import terser from '@rollup/plugin-terser';

export default [
  {
    input: "src/main.js",
    output: [
      {
        file: "js/min.js",
        format: "iife",
        sourcemap: true,
        plugins: [terser()],
      },
    ],
  },
  {
    input: "src/search.js",
    output: [
      {
        file: "js/search-min.js",
        format: "iife",
        sourcemap: true,
        plugins: [terser()],
      },
    ],
  }
];
