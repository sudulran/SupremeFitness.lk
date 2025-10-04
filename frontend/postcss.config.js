const tailwindPostcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    // Use the explicit required plugin to avoid ambiguous name resolution
    tailwindPostcss(),
    autoprefixer(),
  ],
};
