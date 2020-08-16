module.exports = {
  purge: [
    './pages/**/*.js',
    './_layouts/**/*.js',
  ],
  theme: {
    extend: {
      screens: {
        'dark-mode': { raw: '(prefers-color-scheme: dark)' }
      }
    }
  },
  variants: {},
  plugins: [],
}