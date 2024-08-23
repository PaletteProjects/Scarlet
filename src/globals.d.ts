declare global {
  var scarlet: {
    version: string,
    mods: (import("scarlet").Mod)[];
  };
}

export {};
