/*
 * Scarlet, a TETR.IO client mod
 *
 * Copyright (c) 2024 rini
 * SPDX-License-Identifier: Apache-2.0
 */

import core from "mods/core";
import discordRpc from "mods/discordRpc";
import { Mod } from "scarlet";

declare const INCLUDE_EXTRA: boolean;

export const mods = [
  core,
  ...INCLUDE_EXTRA
    ? [
      discordRpc,
    ]
    : [],
] as Mod[];
