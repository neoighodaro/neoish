import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <base href="/" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <meta name="description" content="Software engineer working at ABOUT YOU." />
          <meta itemProp="name" content="Neo Ighodaro – Software Engineer" />
	       <meta itemProp="description" content="Software engineer working at ABOUTYOU" />
	       <meta name="twitter:card" content="summary_large_image" />
	       <meta name="twitter:title" content="Neo Ighodaro – Software Engineer" />
	       <meta name="twitter:description" content="Software engineer working at ABOUTYOU" />
	       <meta property="og:url" content="https://neoighodaro.com/" />
	       <meta property="og:type" content="website" />
  	       <meta property="og:title" content="Neo Ighodaro – Software Engineer" />
	       <meta property="og:description" content="Software engineer working at ABOUTYOU" />

	       <link href="https://fonts.googleapis.com/css?family=Barlow:400,500,700" rel="stylesheet" />
	       <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
	       <link href="/assets/style.css" rel="stylesheet" />
	       <link href="/assets/favicon.ico" rel="shortcut icon" />        
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument