import Head from "next/head";

export default function DefaultLayout({ description, title, children, path, image }) {
  let jsonLd = JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Person",
    name: "Neo Ighodaro",
    url: "https://neoighodaro.com",
    image: "https://neoighodaro.com/assets/neo.jpg",
    sameAs: [
      "https://medium.com/@neo",
      "https://github.com/neoighodaro",
      "https://twitter.com/neoighodaro",
      "https://instagram.com/neoighodaro",
      "https://de.linkedin.com/in/neoighodaro",
      "https://www.youtube.com/channel/UCswNxJGBTEQY2yHMdyfGC6A",
    ],
    jobTitle: "Lead Software Engineer",
    worksFor: {
      "@type": "Organization",
      name: "deineBAUSTOFFE",
    },
  });

  return (
    <main>
      <Head>
        <title>{title}</title>
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
        <meta property="og:image" content={image || "https://neoighodaro.com/assets/neo.jpg"} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `${jsonLd}` }} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <div className="bg-indigo-800 h-1 md:h-2 w-full pin-t pin-l fixed"></div>
      <div className="max-w-4xl mx-auto w-full px-8">{children}</div>
    </main>
  );
}
