/*
 * Scarlet, a TETR.IO client mod
 *
 * Copyright (c) 2024 rini
 * SPDX-License-Identifier: Apache-2.0
 */

import simpleHeader from "eslint-plugin-simple-header";
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["src/**/*.ts", "build.ts", "eslint.config.js"],
  plugins: {
    "simple-header": simpleHeader,
  },
  languageOptions: {
    parser: tseslint.parser,
  },
  rules: {
    "simple-header/header": ["error", {
      text: [
        "Scarlet, a TETR.IO client mod",
        "",
        "Copyright (c) {year} {author}",
        "SPDX-License-Identifier: Apache-2.0",
      ],
      templates: { author: [".*", "rini"] },
    }],

    "constructor-super": "warn",
    "for-direction": "warn",
    "getter-return": "warn",
    "no-async-promise-executor": "warn",
    "no-constant-binary-expression": "warn",
    "no-constant-condition": "warn",
    "no-dupe-else-if": "warn",
    "no-duplicate-case": "warn",
    "no-fallthrough": "warn",
    "no-irregular-whitespace": "error",
    "no-loss-of-precision": "warn",
    "no-promise-executor-return": "warn",
    "no-prototype-builtins": "warn",
    "no-self-assign": "warn",
    "no-self-compare": "warn",
    "no-setter-return": "warn",
    "no-unmodified-loop-condition": "warn",
    "no-unreachable-loop": "warn",
    "no-useless-assignment": "warn",
    "use-isnan": "warn",

    "eqeqeq": ["warn", "smart"],
    "grouped-accessor-pairs": "warn",
    "logical-assignment-operators": "warn",
    "no-case-declarations": "warn",
    "no-delete-var": "error",
    "no-else-return": ["warn", { allowElseIf: false }],
    "no-empty": "warn",
    "no-empty-static-block": "warn",
    "no-extra-boolean-cast": "warn",
    "no-extra-label": "warn",
    "no-invalid-this": "warn",
    "no-label-var": "warn",
    "no-lone-blocks": "warn",
    "no-lonely-if": "warn",
    "no-shadow-restricted-names": "warn",
    "no-unused-expressions": "warn",
    "one-var": ["warn", "never"],
    "operator-assignment": "warn",
    "prefer-arrow-callback": "warn",
    "prefer-const": ["warn", { destructuring: "all" }],
    "prefer-destructuring": ["warn", {
      VariableDeclarator: { array: false, object: true },
      AssignmentExpression: { array: false, object: false },
    }],
    "prefer-exponentiation-operator": "warn",
    "prefer-object-spread": "warn",
    "prefer-spread": "warn",
    "yoda": "warn",
  },
});
