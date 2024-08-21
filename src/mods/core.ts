/*
 * Scarlet, a TETR.IO client mod
 *
 * Copyright (c) 2024 rini
 * SPDX-License-Identifier: Apache-2.0
 */

import { Author, define, devs, html, Mod, query, re, replace } from "scarlet";

// TODO: image needs a ?rv= to avoid cache, which seems to be very, very long
const ModAuthor = (author: Author) => {
  const src = author.id ? `/user-content/avatars/${author.id}.jpg` : "/res/avatar.png";

  return html`<img
    class="avatar" width="48"
    :alt="${author.name}" :title="${author.name}" :src="${src}"
    @click="${() => author.id && core.openProfile({ userID: author.id })}"
  >`;
};

const ModSettings = (mod: Mod) =>
  html`<div class="scroller_block">
    <h1
      class="checkbox rg_target_pri" :class="{ checked: true, disabled: ${mod.builtin} }"
      data-hover="tap" data-hit="click"
      x-text="${mod.name.toUpperCase()}"
    ></h1>
    <div class="button_tr_h" x-setup="${mod.authors}.forEach(a => $el.append(${ModAuthor}(a)))"></div>
    <p x-text="${mod.description}||''"></p>
  </div>`;

const SettingsMenu = () =>
  html`<div
    class="right_scroller ns"
    data-menuview="config_scarlet"
    x-setup="scarlet.mods.forEach(m => $el.append(${ModSettings}(m)))"
  >
    <div class="scroller_block">
      <h1 x-text='"SCARLET " + scarlet.version'></h1>
    </div>
  </div>`;

const SettingsButton = () =>
  html`<div
    class="scroller_item scroller_item_config has_description ns rg_target_pri"
    data-hover="hover" data-hit="hit2"
    @click='${() => core.switchMenu("config_scarlet")}'
  >
    <h1>SCARLET</h1>
    <p>configure SCARLET</p>
  </div>`;

const core = define({
  name: "scarlet/core",
  authors: [devs.rini],
  description: "SCARLET's core functionality.",
  patches: [
    replace(
      re`config_account:{back:"config",header:"CONFIG / ACCOUNT"`,
      `config_scarlet:{back:"config",header:"CONFIG / SCARLET",footer:"configure SCARLET and its mods!"},$&`,
    ),
    replace(
      re`config_account:{\(starter:"f!.rg_target_pri",\.\*\?\)},`,
      "config_scarlet:{$1},$&",
    ),

    // don't bother osk with our bugs!
    replace(re`window.XDBG_COMMITLOG=()=>{`, "$&return;"),
    replace(re`(?g)window.console.\i=`, ""),

    replace(re`\i||window.IS_ELECTRON&&"never"!==\i.electron.loginskip`, "true"),
    replace(re`loadProvider:async function(){`, "$&return;"),

    replace(re`function \(\i\)(\i,\i){(\i[\i].onexit||`, "$self.switchMenu=$1;$&"),
    replace(re`function \(\i\)(\i){\.\{1,96},\i.classList.add("tetra_modal")`, "$self.openProfile=$1;$&"),
  ],
  start() {
    query("#config_account")?.before(SettingsButton());
    query("#menus")?.prepend(SettingsMenu());
  },

  switchMenu(_target: string) {},
  openProfile(_user: { userID: string } | { username: string }) {},
});

export default core;
