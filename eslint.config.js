const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    ignores: [".next/**", "node_modules/**", ".vercel/**", "out/**"],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "import/order": "off",
    },
  },
];
