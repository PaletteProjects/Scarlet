import { execSync } from "child_process";
import { build, BuildOptions, context } from "esbuild";
import { readFile, writeFile } from "fs/promises";
import { minify, MinifyOptions } from "uglify-js";

const watch = process.argv.includes("--watch") || process.argv.includes("-w");
const includeExtra = process.argv.includes("--extra");

const gitHash = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
const version = `${process.env.npm_package_version!}+git.${gitHash}`;

const userscriptHeader = (meta: any) =>
  [
    "// ==UserScript==",
    ...Object.entries(meta).map(([k, v]) => `// @${k.padEnd(14)}  ${v}`),
    "// ==/UserScript==",
    "",
  ]
    .join("\n");

const options: BuildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minifySyntax: true,
  minifyWhitespace: true,
  minifyIdentifiers: false,
  define: {
    VERSION: JSON.stringify(version),
    INCLUDE_EXTRA: JSON.stringify(includeExtra),
  },
  logLevel: "info",
  plugins: [
    {
      name: "uglify",
      setup(build) {
        const path = build.initialOptions.outfile!;
        const preamble = build.initialOptions.banner?.js;
        const options: MinifyOptions = {
          output: { preamble, beautify: true, },
          compress: {
            passes: 8,
          },
          mangle: false,
        };

        build.onEnd(async () => {
          await writeFile(path, minify(await readFile(path, "utf8"), options).code);
        });
      },
    },
  ],
};

const userscript = <BuildOptions> {
  ...options,
  banner: {
    js: userscriptHeader({
      "name": "Scarlet",
      "match": "*://tetr.io/",
      "run-at": "document-start",
    }),
  },
  define: {
    ...options.define,
    window: "unsafeWindow",
  },
};

const targets = <BuildOptions[]> [
  { ...options, outfile: "dist/index.js" },
  { ...userscript, outfile: "dist/Scarlet.user.js" },
];

targets.forEach(watch ? async target => (await context(target)).watch() : build);
