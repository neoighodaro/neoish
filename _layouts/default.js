import Head from 'next/head'

export default function DefaultLayout(props) {
  return (
    <main>
      <Head>
        <title>{props.title}</title>
        <meta name='description' content={props.description}/>
        <meta itemProp="description" content={props.description} />
        <meta itemProp="name" content={props.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={props.description} />
        <meta property="og:url" content="https://neoighodaro.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
      </Head>
      
      <div className="bg-indigo-800 h-1 md:h-2 w-full pin-t pin-l fixed"></div>
      <div className="max-w-3xl mx-auto w-full px-8">
        {props.children}
      </div>
    </main>
 )
}