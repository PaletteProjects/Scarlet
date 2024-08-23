/*!
 * Scarlet, a TETR.IO client mod
 *
 * Copyright (c) 2024 rini
 * SPDX-License-Identifier: Apache-2.0
 */

import core from "mods/core";
import { Mod } from "scarlet";

const mods: Mod[] = [core];
const consoleStyle = ["color:lightskyblue", "color:currentColor;font-weight:400"];


window.scarlet = {
  version: VERSION,
  mods,
};

console.log(
  `%cScarlet > %cLoading ${VERSION}! ${mods.length} mods installed`,
  ...consoleStyle,
);

const eval_ = window.eval;
window.eval = (src) => {
  mods.forEach((mod, id) => {
    console.group(
      `%cScarlet > %cApplying patches from ${mod.name}`,
      ...consoleStyle,
    );

    mod.patches?.forEach(fn => src = fn(src, id));
    mod.start?.();

    console.groupEnd();
  });

  (window.eval = eval_)(src + "\n//# sourceURL=js/tetrio.js");
};

declare const VERSION: string;
