import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <base href="/" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="viewport-fit=cover" />
          <link href="https://fonts.googleapis.com/css?family=Barlow:400,500,600,700&display=swap" rel="stylesheet" />
          <link href="/assets/style.css" rel="stylesheet" />
          <link href="/favicon.ico" rel="shortcut icon" />
        </Head>
        <body className="dark-mode:bg-gray-900 bg-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
