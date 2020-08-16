import PostLayout from '../../_layouts/post'
import { getPostBySlug, getAllPosts } from "../../api"
 
export default function Post(props) {
  return <PostLayout title={props.title} content={props.content}/>
}
 
export async function getStaticProps(context) {
  return {
    props: {
      title: "Hello world",
      content: "How are you doing?"
    }//await getPostBySlug(context.params.slug)
  }
}
 
export async function getStaticPaths() {
//  let paths = await getAllPosts()
//  paths = paths.map(post => ({
//    params: { slug: post.slug }
//  }));
  
  return {
//    paths: paths,
    paths: [{
      params: {
        slug: 'hello-world'
      }     
    }],
    fallback: false
  }
}