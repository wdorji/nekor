module.exports = {
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@next/next/no-img-element": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-unused-vars": "warn",
  },
};
