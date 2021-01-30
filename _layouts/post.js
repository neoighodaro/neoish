import Link from "next/link";
import DefaultLayout from "./default";
import { useRouter } from "next/router";
import {Helmet} from 'react-helmet';

export default function PostLayout({ title, content, meta }) {
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
      
      

      <article className="py-12 md:py-16 max-w-full prose lg:prose-lg dark-mode:prose-dark">
        <h1>{title}</h1>
        <div class="mb-4" dangerouslySetInnerHTML={{ __html: content }} />
        <Helmet>
          <script src="https://utteranc.es/client.js"
            repo="neoighodaro/neoish-comments"
            issue-term="title"
            theme="preferred-color-scheme"
            crossorigin="anonymous"
            async>
          </script>
        </Helmet>
        <div className="mt-10">
          <Link href="/">
            <a>Home</a>
          </Link>
        </div>
      </article>
    </DefaultLayout>
  );
}
