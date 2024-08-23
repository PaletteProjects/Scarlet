import { execSync } from "child_process";
import { build, BuildOptions, context } from "esbuild";
import { readFile, writeFile } from "fs/promises";
import { minify, MinifyOptions } from "uglify-js";

const watch = process.argv.includes("--watch") || process.argv.includes("-w");

const gitHash = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
const version = `${process.env.npm_package_version!}+git.${gitHash}`;

const mkUserscript = (meta: any) =>
  [
    "// ==UserScript==",
    ...Object.entries(meta).map(([k, v]) => `// @${k.padEnd(14)}  ${v}`),
    "// ==/UserScript==",
    "",
  ]
    .join("\n");

const userscriptMeta = mkUserscript({
  "name": "Scarlet",
  "match": "*://tetr.io/",
  "run-at": "document-start",
});

const options: BuildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  define: {
    VERSION: JSON.stringify(version),
  },
  logLevel: "info",
  plugins: [
    {
      name: "uglify",
      setup(build) {
        if (watch) return;

        const path = build.initialOptions.outfile!;
        const preamble = build.initialOptions.banner?.js;
        const options: MinifyOptions = {
          output: { preamble },
          compress: {
            passes: 8,
          },
        };

        build.onEnd(async () => {
          await writeFile(path, minify(await readFile(path, "utf8"), options).code);
        });
      },
    },
  ],
};

const targets = <BuildOptions[]> [
  { outfile: "dist/index.js" },
  { outfile: "dist/index.min.js", minify: true },
  {
    outfile: "dist/Scarlet.user.js",
    banner: { js: userscriptMeta },
  },
  {
    outfile: "dist/Scarlet.min.user.js",
    banner: { js: userscriptMeta },
    minify: true,
  }
];

targets.map(t => ({ ...options, ...t }))
  .forEach(watch ? t => context(t).then(ctx => ctx.watch()) : build);
