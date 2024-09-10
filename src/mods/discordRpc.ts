/*
 * Scarlet, a TETR.IO client mod
 *
 * Copyright (c) 2024 rini
 * SPDX-License-Identifier: Apache-2.0
 */

import { define, devs, re, replace } from "scarlet";

// umd jumpscare
const loadRpc = async () => {
  const res = await fetch("https://unpkg.com/discord-rpc@4.0.1/browser.js");
  const src = await res.text();
  const mod = { exports: {} } as any;
  Function("module", "exports", src).call(mod, mod, mod.exports);
  return mod.exports;
};

export default define({
  name: "discord-rpc",
  authors: [devs.rini],
  description: "enables rich presence even in browsers. requires a patched arrpc.",
  patches: [
    replace(re`window.IPC.send("presence",`, "$self.updatePresence("),
    replace(re`window.IS_ELECTRON&&!1!==\i.electron.presence`, "true"),
  ],
  start() {
    loadRpc().then(({ Client }) => {
      const client = this.client = new Client({ transport: "websocket" });
      client.connect("688741895307788290");
    });
  },
  updatePresence(obj: any) {
    this.client.setActivity(obj);
  },
  client: null as any,
});
