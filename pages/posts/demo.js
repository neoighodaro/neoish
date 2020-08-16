import PostLayout from '../../_layouts/post'
import { getPostBySlug, getAllPosts } from "../../api"
 
export default function Demo(props) {
  return <PostLayout title={props.title} content={props.content} meta={props.meta} />
}


export async function getStaticProps(context) {
  return {
    props: await getPostBySlug("1-remaking-my-website-again")
  }
}