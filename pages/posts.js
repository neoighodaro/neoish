import Link from "next/link";
import { useRouter } from "next/router";
import DefaultLayout from "../_layouts/default";
import { getConfig, getAllPosts } from "../api";
import Card from "../_layouts/components/posts/card";

function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

function BreadCrumbs() {
  return (
    <div className="pt-6 md:pt-12">
      <nav className="flex sm:hidden breadcrumbs">
        <Link href="/">
          <a title="Home" className="crumb">
            Home
          </a>
        </Link>
      </nav>
      <nav className="hidden sm:flex breadcrumbs">
        <Link href="/">
          <a className="crumb">Home</a>
        </Link>
        <svg className="flex-shrink-0 mx-2 h-5 w-5 dark-mode:text-gray-600 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="active-crumb">Posts</span>
      </nav>
    </div>
  );
}

export default function Posts({ title, posts, config }) {
  const router = useRouter();
  const page = parseInt(router.query.page) || 1;
  const pagePosts = paginate(posts, config.postsPerPage, page);

  if (pagePosts.length === 0) {
    router.push("/posts");
  }

  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = paginate(posts, config.postsPerPage, page + 1).length === 0 ? null : page + 1;

  return (
    <DefaultLayout title={title} config={config} description={config.postsPageDescription} path="/posts">
      <BreadCrumbs />
      <header className="flex flex-col justify-start md:flex-row-reverse md:justify-between md:items-center pt-16 md:py-18">
        <div className="mb-8 md:mb-0">
          <img className="avatar" src={config.logoImage} alt={config.name} />
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h1 className="mb-1 text-xl sm:text-xl md:text-2xl font-bold text-gray-800 dark-mode:text-gray-100 leading-tight">{config.name}</h1>
          <span className="text-md sm:text-lg text-gray-600 dark-mode:text-gray-400 leading-normal">
            I write articles here and also on&nbsp;
            <a
              href={config.mediumLink}
              title="Articles on Medium"
              target="_blank"
              rel="noopener"
              className="font-medium text-indigo-500 hover:text-indigo-700">
              Medium
            </a>
          </span>
          <div className="flex items-center mt-4">
            <a
              href={config.mediumLink}
              title="Articles on Medium"
              target="_blank"
              rel="noopener"
              className="text-sm font-medium bg-gray-200 dark-mode:bg-white px-2 md:px-6 py-1 rounded-md hover:bg-gray-600 hover:text-white transition duration-200 ease-in-out">
              Follow
            </a>
            <span className="px-3 text-gray-800 dark-mode:text-white font-bold text-md leading-loose">&bull;</span>
            <span className="text-gray-600 dark-mode:text-white text-sm font-medium">
              <Link href="https://medium.com/@neo/followers">
                <a target="_blank" rel="noopener" className="hover:underline">
                  {config.mediumFollowersCount} Followers
                </a>
              </Link>
            </span>
          </div>
        </div>
      </header>

      <hr className="dark-mode:border-gray-800 my-10" />

      <div className="px-4 pt-10">
        <div className="flex flex-wrap -mx-4">
          {pagePosts.map((post) => (
            <Card post={post} key={post.slug} />
          ))}
        </div>
      </div>

      <div className="px-4 pt-10 pb-16 flex items-center justify-between sm:px-0">
        <div className="w-0 flex-1 flex">
          <Link href={{ pathname: "/posts", query: { page: previousPage } }}>
            <a
              className={
                (previousPage ? "" : "pointer-events-none ") +
                "-mt-px border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150"
              }>
              <svg className="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </a>
          </Link>
        </div>
        <div className="w-0 flex-1 flex justify-end">
          <Link href={{ pathname: "/posts", query: { page: nextPage } }}>
            <a
              className={
                (nextPage ? "" : "pointer-events-none ") +
                `-mt-px border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150`
              }>
              Next
              <svg className="ml-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
}

export async function getStaticProps() {
  const config = await getConfig();
  const allPosts = await getAllPosts();

  return {
    props: {
      config,
      title: config.title,
      posts: allPosts,
    },
  };
}
