import Head from "next/head";
import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "../components/themeContext";

export default function DefaultLayout({ description, title, children, path, image, additionalJsonLd, config }) {
  let finalJsonLd = [
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      name: config.name,
      url: config.baseUrl,
      image: config.logoImage.url,
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
    <ThemeProvider>
      <PlausibleProvider domain={config.plausible.domain} enabled={config.plausible.enabled || undefined}>
        <main className="mb-20">
          <Head>
            <title>{title}</title>
            <meta name="description" content={description || config.description} />
            <meta name="name" content={title || config.title} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || config.title} />
            <meta name="twitter:description" content={description || config.description} />
            <meta name="twitter:site" content={config.twitter} />
            <meta name="twitter:creator" content={config.twitter} />
            <meta name="twitter:image" content={image || config.logoImage.url} />
            <meta name="twitter:image:alt" content={description || config.description} />
            <meta property="og:url" content={config.baseUrl + (path || "/")} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title || config.title} />
            <meta property="og:description" content={description || config.description} />
            <meta property="og:image" content={image || config.logoImage.url} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `${jsonLd}` }} />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
          </Head>

          <div className="fixed z-10 w-full h-1 bg-indigo-800 md:h-2 pin-t pin-l"></div>
          <div className="w-full max-w-4xl px-8 mx-auto">{children}</div>
        </main>
      </PlausibleProvider>
    </ThemeProvider>
  );
}
