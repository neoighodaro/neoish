const defaultTheme = require('tailwindcss/defaultTheme');


const color = (color, shade) => ({ color: defaultTheme.colors[color][shade] });


module.exports = {
  purge: [
    './pages/**/*.js',
    './_layouts/**/*.js',
  ],
  theme: {
    typography: {
      dark: {
        css: {
          color: defaultTheme.colors.gray[200],
          '[class~="lead"]': color('gray', 300),
          a: color('indigo', 500),          
          strong: color('gray', 200),          
          h1: color('gray', 300),
          h2: color('gray', 300),
          h3: color('gray', 300),
          h4: color('gray', 300),
          blockquote: color('gray', 400),
          'ol > li::before': color('gray', 200),
          hr: {
            borderColor: defaultTheme.colors.gray[600]
          },
         code: color('gray', 300),
        },
      },
    },
    extend: {
      screens: {
        'dark-mode': { raw: '(prefers-color-scheme: dark)' }
      }
    }
  },
  variants: {
    padding: ['responsive', 'odd'],
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}