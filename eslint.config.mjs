import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

const eslintConfig = [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
      "react/prop-types": "off",
    },
  },
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "eslint:recommended",
      "plugin:jest/recommended",
      "prettier",
    ],
    // settings: { next: { rootDir: "packages/my-app/" } },
  }),
  {
    ignores: [".next/", "./infra/migrations/"],
  },
];

export default eslintConfig;
