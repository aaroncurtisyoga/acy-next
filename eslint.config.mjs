import nextConfig from "eslint-config-next";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      ".vercel/**",
      "next-env.d.ts",
    ],
  },
  ...nextConfig,
  {
    rules: {
      "import/order": "off",
    },
  },
];
