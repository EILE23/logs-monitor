const withTM = require("next-transpile-modules")([
  "antd",
  "@ant-design/icons",
  "@ant-design/icons-svg",
  "rc-util",
  "rc-pagination",
  "rc-tree",
  "rc-table",
  "rc-picker",
  "rc-input",
]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
});

module.exports = nextConfig;
