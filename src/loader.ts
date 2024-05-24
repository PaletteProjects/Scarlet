import { html } from "anguishjs";

export const re = (template: TemplateStringsArray) => {
  const raw = template.raw[0];
  const flags = raw.match(/^\(\?([a-z]+)\)/);
  return new RegExp(
    raw
      .slice(flags?.[0].length)
      .replace(/\\*[.*+?^${()|[]/g, (m) => m.length % 2 ? "\\" + m : m.slice(1))
      .replace(/\\i/g, "[A-Za-z_$][\\w$]*"),
    flags?.[1],
  );
};

export const patch = (match: string | RegExp, repl: string): Patch => (src, id) => {
  const oldSrc = src;
  src = src.replace(match, repl.replace("$self", `scarlet.mods[${id}]`));
  if (oldSrc === src) console.warn(`Patch failed: ${match}`);
  return src;
};

export { html };

export const query = (selector: string) => {
  return document.querySelector(selector) ?? (console.warn(`Selector failed: ${selector}`), null);
};

const injector = (fn: string) => (selector: string) => (...a: Parameters<typeof html>): void =>
  (query(selector) as any)?.[fn](html(...a));

export const after = injector("after");
export const before = injector("before");
export const append = injector("append");
export const prepend = injector("prepend");

export type Patch = (src: string, id: number) => string;

export interface Mod {
  name: string;
  patches?: Patch[];
  start?: () => void;
}

export const define = <T extends Mod>(m: T) => m as Mod;
