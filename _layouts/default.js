import Head from "next/head";
import PlausibleProvider from "next-plausible";

export default function DefaultLayout({ description, title, children, path, image, additionalJsonLd, config }) {
  let finalJsonLd = [
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      name: config.name,
      url: config.baseUrl,
      image: config.logoImage,
      sameAs: config.social,
      jobTitle: config.jobTitle,
      worksFor: {
        "@type": "Organization",
        name: config.employer,
      },
    },
  ];

  if (additionalJsonLd) {
    finalJsonLd.push(additionalJsonLd);
  }

  let jsonLd = JSON.stringify(finalJsonLd);

  return (
    <PlausibleProvider domain={config.plausible.domain} enabled={config.plausible.enabled || undefined}>
      <main>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description || config.description} />
          <meta name="name" content={title || config.title} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title || config.title} />
          <meta name="twitter:description" content={description || config.description} />
          <meta name="twitter:site" content={config.twitter} />
          <meta name="twitter:creator" content={config.twitter} />
          <meta property="og:url" content={config.baseUrl + (path || "/")} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={title || config.title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={image || config.image} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `${jsonLd}` }} />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>

        <div className="bg-indigo-800 h-1 md:h-2 w-full pin-t pin-l fixed z-10"></div>
        <div className="max-w-4xl mx-auto w-full px-8">{children}</div>
      </main>
    </PlausibleProvider>
  );
}
