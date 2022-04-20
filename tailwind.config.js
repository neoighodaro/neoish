const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./pages/**/*.js", "./_layouts/**/*.js"],
  theme: {
    extend: {},
    fontFamily: {
      display: ["Barlow", ...defaultTheme.fontFamily.sans],
      body: ["Barlow", ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
