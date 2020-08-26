import Link from 'next/link'
import Head from 'next/head'
import DefaultLayout from '../_layouts/default'
import { getConfig, getAllPosts } from '../api'

export default function Posts({ title, description, posts }) {
  const mediumFollowersCount = '1.2K';
  
  return (
    <DefaultLayout title={title} description={description}>
    
      <div className="pt-6">
        <nav className="sm:hidden flex">
          <Link href='/'>
            <a title="Home" className="flex items-center text-sm leading-5 font-medium dark-mode:text-gray-400 text-gray-700 hover:text-indigo-700 transition duration-150 ease-in-out">
             Home
            </a>
          </Link>
        </nav>
        <nav className="hidden sm:flex items-center text-sm leading-5 font-medium">
          <Link href='/'>        
           <a className="dark-mode:text-gray-400 text-gray-700 hover:text-indigo-700 transition duration-150 ease-in-out">Home</a>
          </Link>            
          <svg className="flex-shrink-0 mx-2 h-5 w-5 dark-mode:text-gray-600 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-600">Posts</span>
        </nav>
      </div>


      <header className="flex flex-col justify-start md:flex-row-reverse md:justify-between md:items-center pt-16 md:py-18">
        <div className="mb-8 md:mb-0">
          <img className="block mx-auto md:mx-0 h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 border-4 border-white rounded-full border-indigo-700 dark-mode:border-indigo-500" src="/assets/neo.GIF" alt="Neo" />
        </div>
          
        <div className="flex flex-col items-center md:items-start">
          <h1 className="mb-1 text-xl sm:text-xl md:text-2xl font-bold text-gray-800 dark-mode:text-gray-100 leading-tight">Neo Ighodaro</h1>
          <span className="text-md sm:text-lg text-gray-600 dark-mode:text-gray-400 leading-normal">I write articles here and also on <a href="https://medium.com/@neo" title="Articles on Medium" target="_blank" rel="noopener" className="font-medium text-indigo-500 hover:text-indigo-700">Medium</a>.</span>
          <div className="flex items-center mt-4">
            <a href="https://medium.com/@neo" title="Articles on Medium" target="_blank" rel="noopener" className="text-sm font-medium bg-gray-200 dark-mode:bg-white px-2 md:px-6 py-1 rounded-sm hover:bg-indigo-600 hover:text-white transition duration-200 ease-in-out">Follow</a>
            <span className="px-3 text-gray-800 dark-mode:text-white font-bold text-md leading-loose">&bull;</span>
            <span className="text-gray-600 dark-mode:text-white text-sm font-medium">{mediumFollowersCount} Followers</span>
          </div>
        </div>
      </header>
      
      <hr className="dark-mode:border-gray-800 my-10" />
      
      <div className="rounded-md dark-mode:bg-gray-900 overflow-hidden">
        <Link href="/">
          <a title="Post title">
            <div className="h-32 md:h-64 dark-mode:bg-gray-800">
              <img src="https://miro.medium.com/max/1400/1*Cbn9fgwjzMGSgXOilm6-pQ.png" className="w-full h-32 md:h-64 object-cover" />
            </div>
            <div className="p-1">
              <h2 className="text-gray-700 dark-mode:text-white font-medium text-xl md:text-2xl">This is the articles title</h2>
            </div>
          </a>
        </Link> 
      </div>

    </DefaultLayout>
  )
}

export async function getStaticProps() {
  const config = await getConfig()
  const allPosts = await getAllPosts()
  
  return {
    props: {
      title: config.title,
      posts: allPosts,
      description: config.description,
    }
  }
}
