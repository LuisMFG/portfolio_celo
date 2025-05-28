// next.config.js (no root do projeto)
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

module.exports = withNextIntl({
  // aqui entram suas outras configs: reactStrictMode, etc.
});
