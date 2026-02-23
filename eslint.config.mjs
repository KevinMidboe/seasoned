import path from "node:path";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import { configs, plugins } from "eslint-config-airbnb-extended";
import { rules as prettierConfigRules } from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const CUSTOM_RULES = {
  "vue/no-v-model-argument": "off",
  "no-underscore-dangle": "off",
  "vue/multi-word-component-names": "off"
};

const gitignorePath = path.resolve(".", ".gitignore");

// ESLint recommended config
const jsConfig = defineConfig([
  {
    name: "js/config",
    ...js.configs.recommended
  },
  plugins.stylistic,
  plugins.importX,
  ...configs.base.recommended // Airbnb base recommended config
]);

// Node & Airbnb recommended config
const nodeConfig = defineConfig([plugins.node, ...configs.node.recommended]);

// Typescript & Airbnb base TS config
const typescriptConfig = defineConfig([
  plugins.typescriptEslint,
  ...configs.base.typescript
  // rules.typescript.typescriptEslintStrict
]);

// Prettier config
const prettierConfig = defineConfig([
  {
    name: "prettier/plugin/config",
    plugins: {
      prettier: prettierPlugin
    }
  },
  {
    name: "prettier/config",
    rules: {
      ...prettierConfigRules,
      "prettier/prettier": "error"
    }
  }
]);

export default defineConfig([
  // Ignore files and folders listed in .gitignore
  includeIgnoreFile(gitignorePath),
  ...jsConfig,
  ...nodeConfig,
  ...typescriptConfig,
  ...prettierConfig,
  {
    rules: CUSTOM_RULES
  }
]);
