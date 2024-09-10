/*!
 * Scarlet, a TETR.IO client mod
 *
 * Copyright (c) 2024 rini
 * SPDX-License-Identifier: Apache-2.0
 */

import { mods } from "./mods";

const consoleStyle = ["color:lightskyblue", "color:currentColor;font-weight:400"];

(window as any).scarlet = { version: VERSION, mods };

console.log(
  `%cScarlet > %cLoading ${VERSION}! ${mods.length} mods installed`,
  ...consoleStyle,
);

const applyPatches = (src: string) => {
  mods.forEach((mod, id) => {
    console.group(
      `%cScarlet > %cApplying patches from ${mod.name}`,
      ...consoleStyle,
    );

    mod.patches?.forEach(fn => src = fn(src, id));
    mod.start?.();

    console.groupEnd();
  });

  return src;
};

const createObject = URL.createObjectURL;
URL.createObjectURL = (blob) => {
  if (blob instanceof Blob && blob.type === "text/javascript") {
    blob.text().then(src => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.text = applyPatches(src);
      document.head.append(script);
    });

    return (URL.createObjectURL = createObject)(new Blob([], { type: blob.type }));
  }
  return createObject(blob);
};

declare const VERSION: string;
