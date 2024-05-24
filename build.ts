import { execSync } from "child_process";
import { build, BuildOptions, context } from "esbuild";
import { readFile, writeFile } from "fs/promises";
import { minify, MinifyOptions } from "uglify-js";
import autoImport from "unplugin-auto-import/esbuild";

const watch = process.argv.includes("--watch") || process.argv.includes("-w");

const gitHash = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
const version = `${process.env.npm_package_version!}+git.${gitHash}`;

const userscript = (meta: any) =>
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
  minify: !watch,
  define: {
    VERSION: JSON.stringify(version),
  },
  plugins: [
    autoImport({
      dts: true,
      imports: [{
        from: "loader",
        imports: ["after", "before", "append", "prepend", "query", "html", "patch", "re", "define"],
      }, {
        from: "loader",
        imports: ["Mod", "Patch"],
        type: true,
      }],
    }),
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
  {
    outfile: "dist/Scarlet.js",
  },
  {
    outfile: "dist/Scarlet.user.js",
    banner: {
      js: userscript({
        "name": "Scarlet",
        "match": "*://tetr.io/",
        "run-at": "document-start",
      }),
    },
  },
];

targets.map(t => ({ ...options, ...t }))
  .forEach(watch ? t => context(t).then(ctx => ctx.watch()) : build);
