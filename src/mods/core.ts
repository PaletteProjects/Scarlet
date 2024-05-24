/*
 * Scarlet, a TETR.IO client mod
 *
 * Copyright (c) 2024 rini
 * SPDX-License-Identifier: Apache-2.0
 */

const ModSettings = (mod: Mod) =>
  html`<div class="scroller_block" x-data="${mod}">
    <h1
      data-hover="tap" data-hit="click"
      class="checkbox rg_target_pri" :class="{ checked: true, disabled: true }"
      @click="" x-text="name.toUpperCase()"
    ></h1>

    nya
  </div>`;

export default define({
  name: "core",
  patches: [
    patch(
      re`config_account:{back:"config",header:"CONFIG / ACCOUNT"`,
      `config_scarlet:{back:"config",header:"CONFIG / SCARLET",footer:"configure SCARLET and it's mods!"},$&`,
    ),

    // don't bother osk with our bugs :3
    patch(re`window.XDBG_COMMITLOG = () => {`, "$&return;"),
    patch(re`(?g)window.console.\i =`, ""),

    patch(re`\i||window.IS_ELECTRON&&"never"!==\i.electron.loginskip`, "true"),

    patch(re`function \(\i\)(\i,\i){(\i[\i].onexit||`, "$self.switchMenu=$1;$&"),
  ],
  start() {
    before("#config_account")`<div
      data-hover="hover" data-hit="hit2"
      class="scroller_item scroller_item_config has_description ns rg_target_pri"
      @click='${() => this.switchMenu("config_scarlet")}'
    >
      <h1>SCARLET</h1>
      <p>configure SCARLET</p>
    </div>`;

    append("#menus")`<div class="right_scroller ns" data-menuview="config_scarlet" x-data="{
      setup() {
        scarlet.mods.forEach(m => $root.append(Mod(m)));
      },
      Mod: ${ModSettings},
    }">
      <div class="scroller_block">
        <h1 x-text='"SCARLET " + scarlet.version'></h1>
      </div>
    </div>`;
  },
  switchMenu(_target: string) {},
});
