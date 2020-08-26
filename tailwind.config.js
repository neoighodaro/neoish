const defaultTheme = require("tailwindcss/defaultTheme");
const color = (color, shade) => ({ color: defaultTheme.colors[color][shade] });

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: ["./pages/**/*.js", "./_layouts/**/*.js"],
  theme: {
    typography: {
      dark: {
        css: {
          color: defaultTheme.colors.gray[200],
          '[class~="lead"]': color("gray", 300),
          a: color("indigo", 500),
          strong: color("gray", 200),
          h1: color("gray", 300),
          h2: color("gray", 300),
          h3: color("gray", 300),
          h4: color("gray", 300),
          blockquote: color("gray", 400),
          "ol > li::before": color("gray", 200),
          hr: {
            borderColor: defaultTheme.colors.gray[600],
          },
          code: color("gray", 300),
        },
      },
    },
    extend: {
      screens: {
        "dark-mode": { raw: "(prefers-color-scheme: dark)" },
      },
      spacing: {
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
      },
    },
    fontFamily: {
      display: ["Barlow", ...defaultTheme.fontFamily.sans],
      body: ["Barlow", ...defaultTheme.fontFamily.sans],
    },
  },
  variants: {
    padding: ["responsive", "odd"],
  },
  plugins: [require("@tailwindcss/typography")],
};
