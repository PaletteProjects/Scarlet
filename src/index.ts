/*!
 * Scarlet, a TETR.IO client mod
 *
 * Copyright (c) 2024 rini
 * SPDX-License-Identifier: Apache-2.0
 */

import core from "mods/core";

const mods: Mod[] = [core];

declare const VERSION: string;

window.scarlet = {
  version: VERSION,
  loader: { after, before, append, prepend, query, html, patch, re },
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
