import Link from "next/link";
import DefaultLayout from "./default";
import { useRouter } from "next/router";
import useScript from "../hooks/useScript";
import useStyle from "../hooks/useStyle";

export default function PostLayout({ title, content, meta }) {
  useStyle("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.1/styles/dracula.min.css");
  useScript("https://blogstreak.com/static/components/clap.js");

  let seotitle = `${meta.seo_title ? meta.seo_title : title} | Neo Ighodaro`;
  return (
    <DefaultLayout title={seotitle} meta={meta} description={meta.description} path={useRouter().asPath} image={meta.image}>
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
          <Link href="/">
            <a className="text-white no-underline">Home</a>
          </Link>
        </div>
      </article>
    </DefaultLayout>
  );
}
