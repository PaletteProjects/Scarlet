/*!
 * Scarlet, a TETR.IO client mod
 *
 * Copyright (c) 2024 rini
 * SPDX-License-Identifier: Apache-2.0
 */

import core from "mods/core";
import { devs, html, Mod, query, re, replace } from "scarlet";

const mods: Mod[] = [core];
mods.forEach(m => m.builtin = true);

declare const VERSION: string;

window.scarlet = {
  version: VERSION,
  loader: { query, html, replace, re, devs },
  mods,
};

const eval_ = window.eval;
window.eval = (src) => {
  mods.forEach((mod, id) => {
    console.group(
      `%cScarlet > %cApplying patches from ${mod.name}`,
      "color:lightskyblue",
      "color:currentColor;font-weight:400",
    );

    mod.patches?.forEach(fn => src = fn(src, id));
    mod.start?.();

    console.groupEnd();
  });

  (window.eval = eval_)(src + "\n//# sourceURL=js/tetrio.js");
};
