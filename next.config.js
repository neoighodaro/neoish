module.exports = {
  // swcMinify: true,
  // experimental: {
  //   outputStandalone: true,
  // },
  poweredByHeader: false,
  webpack: (config) => {
    config.module.rules.push({ test: /\.md$/, use: "raw-loader" });
    config.module.rules.push({ test: /\.yml$/, use: "raw-loader" });
    return config;
  },
  images: {
    domains: [
      "neoighodaro.com",
      "neoish.s3-eu-west-1.amazonaws.com",
      // TODO: Maybe Migrate?
      "paper-attachments.dropbox.com",
      "user-images.githubusercontent.com",
    ],
  },
};
