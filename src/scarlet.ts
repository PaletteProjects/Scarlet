/*
 * Scarlet, a TETR.IO client mod
 *
 * Copyright (c) 2024 rini
 * SPDX-License-Identifier: Apache-2.0
 */

import { html } from "anguishjs";

export const re = (template: TemplateStringsArray) => {
  const raw = template.raw[0];
  const flags = raw.match(/^\(\?([a-z]+)\)/);
  const regex = new RegExp(
    raw
      .slice(flags?.[0].length)
      .replace(/\\*[.*+?^${()|[]/g, (m) => m.length % 2 ? "\\" + m : m.slice(1))
      .replace(/\\i/g, "[A-Za-z_$][\\w$]*"),
    flags?.[1],
  );
  regex.toString = () => "re`" + raw + "`";
  return regex;
};

export const replace = (match: string | RegExp, repl: string): Patch => (src, id) => {
  const oldSrc = src;
  src = src.replace(match, repl.replace("$self", `scarlet.mods[${id}]`));
  if (oldSrc === src) console.warn(`Patch failed: ${match}`);
  return src;
};

export { html };

export const query = (selector: string) => {
  return document.querySelector(selector) ?? (console.warn(`Selector failed: ${selector}`), null);
};

export type Patch = (src: string, id: number) => string;

export interface Author {
  name: string;
  id?: string;
}

interface ModDefinition {
  name: string;
  authors: Author[];
  description?: string;
  patches?: Patch[];
  start?: () => void;
}

export interface Mod extends ModDefinition {
  required: boolean;
}

export const define = <T extends ModDefinition>(m: T) => m;

// when contributing plugins, please add yourself here!
// if you wish to link your account, get the id by opening your full profile and looking below your avatar
export const devs = {
  rini: {
    name: "rini",
    id: "64640304016672561550b2cd",
  },
} satisfies Record<string, Author>;
