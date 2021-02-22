import Head from "next/head";

export default function DefaultLayout({ description, title, children, path, image }) {
  let jsonLd = JSON.stringify({
    "@context": "http://schema.org/",
    "@type": "Person",
    name: "Neo Ighodaro",
    jobTitle: "Software Engineer",
    url: "http://neoighodaro.com",
    image: "https://neoighodaro.com/assets/neo.jpg",
    sameAs: [
      "https://dev.to/neo",
      "https://medium.com/@neo",
      "https://github.com/neoighodaro",
      "https://twitter.com/NeoIghodaro",
      "https://instagram.com/neoighodaro",
      "https://www.linkedin.com/in/neoighodaro",
      "https://www.youtube.com/channel/UCswNxJGBTEQY2yHMdyfGC6A",
    ],
  });

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
        <meta property="og:image" content={image || "https://neoighodaro.com/assets/neo.jpg"} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `${jsonLd}` }} />
      </Head>

      <div className="bg-indigo-800 h-1 md:h-2 w-full pin-t pin-l fixed"></div>
      <div className="max-w-4xl mx-auto w-full px-8">{children}</div>
    </main>
  );
}
