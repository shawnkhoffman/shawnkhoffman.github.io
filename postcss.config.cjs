module.exports = {
  plugins: {
    tailwindcss: require('tailwindcss'),
    autoprefixer: require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? { cssnano: require('cssnano')({ preset: 'default' }) } : {}),
  },
};