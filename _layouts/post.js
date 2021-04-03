import Link from "next/link";
import moment from "moment";
import DefaultLayout from "./default";
import { useRouter } from "next/router";
import useStyle from "../hooks/useStyle";
import useScript from "../hooks/useScript";

export default function PostLayout({ title, content, meta, config }) {
  useScript("https://blogstreak.com/static/components/clap.js");
  useStyle("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.1/styles/dracula.min.css");

  let date = moment(meta.date).toISOString();
  let path = useRouter().asPath;
  let { image, description } = meta.description;
  let seotitle = `${meta.seo_title ? meta.seo_title : title} | Neo Ighodaro`;

  let jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": config.baseUrl + "/posts",
    },
    headline: meta.seo_title ? meta.seo_title : title,
    image: meta.image,
    url: config.baseUrl + useRouter().asPath,
    datePublished: date,
    dateModified: date,
    author: {
      "@type": "Person",
      name: config.name,
    },
  };

  return (
    <DefaultLayout title={seotitle} config={config} meta={meta} description={description} path={path} image={image} additionalJsonLd={jsonLd}>
      <div className="pt-12 md:pt-16">
        <nav className="sm:hidden flex breadcrumbs">
          <Link href="/posts">
            <a title="Posts" className="crumb">
              <svg className="flex-shrink-0 -ml-1 mr-1 h-5 w-5 dark-mode:text-gray-600 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Posts
            </a>
          </Link>
          <span className="px-3 dark-mode:text-gray-600 text-gray-400">|</span>
          <Link href="/">
            <a title="Home" className="crumb">
              Home
            </a>
          </Link>
        </nav>
        <nav className="hidden sm:flex breadcrumbs">
          <Link href="/">
            <a href="/" className="crumb">
              Home
            </a>
          </Link>
          <svg className="flex-shrink-0 mx-2 h-5 w-5 dark-mode:text-gray-600 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <Link href="/posts">
            <a title="Posts" className="crumb">
              Posts
            </a>
          </Link>
          <svg className="flex-shrink-0 mx-2 h-5 w-5 dark-mode:text-gray-600 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="active-crumb">{title}</span>
        </nav>
      </div>

      <div className="text-center my-6 md:my-12">
        <img src={meta.image} className="rounded-md" alt={meta.seo_title} />
      </div>

      <article className="max-w-full prose lg:prose-lg dark-mode:prose-dark">
        <h1>{title}</h1>

        <div className="mb-4" dangerouslySetInnerHTML={{ __html: content }} />

        <blogstreak-clap title={title}></blogstreak-clap>

        <div className="mt-6 py-4">
          <Link href="/posts">
            <a className="-mt-px pr-1 inline-flex items-center leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150 no-underline">
              <svg className="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"></path>
              </svg>
              Posts
            </a>
          </Link>
        </div>
      </article>
    </DefaultLayout>
  );
}
