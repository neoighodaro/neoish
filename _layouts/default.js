import Head from "next/head";

export default function DefaultLayout({ description, title, children, path, image }) {
  return (
    <main>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="description" content={description} />
        <meta name="name" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content="@neoighodaro" />
        <meta name="twitter:creator" content="@neoighodaro" />
        <meta property="og:url" content={"https://neoighodaro.com" + (path || "/")} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image || "https://neoighodaro.com/assets/neoi.gif"} />
      </Head>

      <div className="bg-indigo-800 h-1 md:h-2 w-full pin-t pin-l fixed"></div>
      <div className="max-w-4xl mx-auto w-full px-8">{children}</div>
    </main>
  );
}
