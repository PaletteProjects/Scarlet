declare global {
  var scarlet: {
    version: string,
    loader: Omit<typeof import("loader"), "define">;
    mods: (import("loader").Mod)[];
  };
}

export {};
