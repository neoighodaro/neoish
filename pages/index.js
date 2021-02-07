import Link from "next/link";
import moment from "moment";
import DefaultLayout from "../_layouts/default";
import { getConfig, getAllPosts } from "../api";
import { truncateString } from "../helpers";

// -----------------------------------------------------------------------------
// List Posts Section
// -----------------------------------------------------------------------------

function ListPostsSection({ posts }) {
  if (posts.length <= 0) {
    return null;
  }

  return (
    <section className="mt-12 md:mt-24 overflow-hidden bg-gray-100 dark-mode:bg-gray-800 absolute w-full left-0 pt-12 pb-8">
      <div className="max-w-4xl mx-auto w-full px-8">
        <h3 className="uppercase text-sm md:text-md text-gray-600 dark-mode:text-gray-500 leading-normal font-medium">Recent Posts</h3>
        <ul className="mt-4 flex flex-wrap -mx-3">
          {posts.map(function (post, idx) {
            return (
              <li key={idx} className="w-full md:w-1/2 flex flex-col px-3 mb-8">
                <div className="flex flex-col">
                  <Link href={`/posts/${post.slug}`}>
                    <a className="font-medium text-lg sm:text-xl leading-normal text-gray-800 dark-mode:text-gray-400 hover:text-indigo-700 transition-all ease-in-out duration-100">
                      {post.title}
                    </a>
                  </Link>
                  <span className="text-sm mt-1 text-gray-600 dark-mode:text-gray-600">{moment(post.meta.date).fromNow()}</span>
                  <div className="leading-normal mt-2 text-gray-600 dark-mode:text-gray-500">{truncateString(post.meta.description, 80)}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default function Home({ title, description, posts }) {
  return (
    <DefaultLayout title={title} description={description}>
      <header className="flex flex-col pt-16 md:pt-18 pb-10 justify-start">
        <div className="mb-8">
          <img className="avatar" src="/assets/neo.jpg" alt="Neo" />
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark-mode:text-gray-100 leading-tight">
            Neo is a Software Engineer
          </h1>
          <span className="text-lg sm:text-xl md:text-2xl text-gray-600 dark-mode:text-gray-400 leading-normal">
            &hellip;and occasional&nbsp;
            <Link href="/posts">
              <a title="Technical Articles by Neo Ighodaro" className="font-medium text-indigo-500 hover:text-indigo-700">
                blogger
              </a>
            </Link>
            &nbsp;and speaker.
          </span>
        </div>

        <div className="mt-4 md:mt-8">
          <div className="flex justify-center md:justify-start md:items-start md:order-2">
            <a href="https://twitter.com/neoighodaro" target="_blank" rel="noopener" title="Twitter" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>

            <a href="https://github.com/neoighodaro" target="_blank" rel="noopener" title="GitHub" className="ml-3 text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            <a
              href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;%6E%65%6F%40%6E%65%6F%69%2E%73%68"
              target="_blank"
              rel="noopener"
              title="GitHub"
              className="ml-3 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Email</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <section className="text-md sm:text-lg text-gray-800 dark-mode:text-gray-200 leading-loose">
        <p>
          I'm a <span className="font-medium">Hoodie</span>
          <sup>†</sup> wearing ambivert currently working at Deine Baustoffe GmbH as a Lead Software Engineer in Hamburg, Germany.</p>
          <p className="mt-3">Before that, I worked as a Senior Software Engineer at           <a
            href="https://aboutyou.de"
            title="ABOUT YOU GmbH"
            target="_blank"
            rel="noopener"
            className="font-medium text-indigo-500 hover:text-indigo-700">
            ABOUT YOU GmbH
          </a> in Hamburg, CTO at <a
            href="https://hotels.ng"
            title="Hotel Booking Limited"
            target="_blank"
            rel="noopener"
            className="font-medium text-indigo-500 hover:text-indigo-700">
            Hotel Booking Limited
          </a>
          &nbsp;and &nbsp;
          <a
            href="https://creativitykills.co"
            title="CreativityKills"
            target="_blank"
            rel="noopener"
            className="font-medium text-indigo-500 hover:text-indigo-700">
            CreativityKills
          </a>
          &nbsp;with both companies based in Lagos, Nigeria.
        </p>
        <p className="mt-5 text-sm text-gray-600 dark-mode:text-gray-500">
          <sup>†</sup> Has been known to wear shirts from time to time.
        </p>
      </section>
      
      <section className="mt-6">
        <h3 className="mb-3 font-medium text-white text-xl capitalize">
          My Story
        </h3>
        <iframe className="rounded-lg" height="200px" width="100%" frameborder="no" scrolling="no" seamless src="https://player.simplecast.com/c1b727e9-b0b8-440a-bf44-78adef07217c?dark="></iframe>    
      </section>

      <ListPostsSection posts={posts} />
    </DefaultLayout>
  );
}

export async function getStaticProps() {
  const config = await getConfig();
  const allPosts = await getAllPosts();

  return {
    props: {
      title: config.title,
      posts: allPosts.slice(0, 2),
      description: config.description,
    },
  };
}
