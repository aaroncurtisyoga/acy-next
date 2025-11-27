import nextConfig from "eslint-config-next";

const config = [
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

export default config;
