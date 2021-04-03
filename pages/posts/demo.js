import PostLayout from "../../_layouts/post";
import { getPostBySlug, getAllPosts, getConfig } from "../../api";

export default function Post(props) {
  return <PostLayout title={props.title} content={props.content} meta={props.meta} config={props.config} />;
}

export async function getStaticProps(context) {
  let config = await getConfig();
  let postProps = await getPostBySlug("1-spoke-laravel-worldwide-meetup-2020");

  return {
    props: {
      config,
      ...postProps,
    },
  };
}
