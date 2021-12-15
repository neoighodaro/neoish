import Link from "next/link";
import moment from "moment";
import Image from "next/image";
import DefaultLayout from "./default";
import { useRouter } from "next/router";
import useStyle from "../hooks/useStyle";
// import useScript from "../hooks/useScript";

export default function PostLayout({ title, content, meta, config }) {
  // useScript("https://blogstreak.com/static/components/clap.js");
  useStyle("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.1/styles/dracula.min.css");

  let date = moment(meta.date).toISOString();
  let path = useRouter().asPath;
  let { image, description } = meta;
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
        <nav className="flex sm:hidden breadcrumbs">
          <Link href="/posts">
            <a title="Posts" className="crumb">
              <svg className="flex-shrink-0 w-5 h-5 mr-1 -ml-1 text-gray-400 dark-mode:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Posts
            </a>
          </Link>
          <span className="px-3 text-gray-400 dark-mode:text-gray-600">|</span>
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
          <svg className="flex-shrink-0 w-5 h-5 mx-2 text-gray-400 dark-mode:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
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
          <svg className="flex-shrink-0 w-5 h-5 mx-2 text-gray-400 dark-mode:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="active-crumb">{title}</span>
        </nav>
      </div>

      <div className="my-6 text-center md:my-12">
        <Image src={meta.image} alt={meta.seo_title} className="rounded-md" width={meta.image_width} height={meta.image_height} priority="true" />
      </div>

      <article className="max-w-full prose lg:prose-lg dark-mode:prose-dark">
        <h1>{title}</h1>

        <div className="mb-4" dangerouslySetInnerHTML={{ __html: content }} />

        <blogstreak-clap title={title}></blogstreak-clap>

        <div className="py-4 mt-6">
          <Link href="/posts">
            <a className="inline-flex items-center pr-1 -mt-px font-medium leading-5 text-gray-500 no-underline transition duration-150 ease-in-out hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400">
              <svg className="w-5 h-5 mr-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
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
