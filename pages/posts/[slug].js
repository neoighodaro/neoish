import PostLayout from "../../_layouts/post";
import { getPostBySlug, getAllPosts, getConfig } from "../../api";

export default function Post(props) {
  return <PostLayout title={props.title} content={props.content} meta={props.meta} config={props.config} />;
}

export async function getStaticProps(context) {
  let config = await getConfig();
  let postProps = await getPostBySlug(context.params.slug);

  return {
    props: {
      config,
      ...postProps,
    },
  };
}

export async function getStaticPaths() {
  let paths = await getAllPosts();
  paths = paths.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths: paths,
    fallback: false,
  };
}
