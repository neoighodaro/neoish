import matter from "gray-matter";
import yaml from "js-yaml";
import marked from "marked";

export async function getAllPosts() {
  const context = require.context("../_posts", false, /\.md$/);
  const posts = [];
    
  for (const key of context.keys().reverse()) {
    const post = key.slice(2);
    const content = await import(`../_posts/${post}`);
    const meta = matter(content.default);
    
    posts.push({
      title: meta.data.title,
      slug: post.replace(".md", ""),
      meta: meta.data,
    });
  }
  
  
  return posts.sort((a, b) => {
    const id = parseInt(a.slug.split('-')[0] || 0) 
    const id2 = parseInt(b.slug.split('-')[0] || 1)
    
    return id > id2 ? -1 : 1;
  });
}

export async function getConfig() {
  const config = await import(`../config.yml`);
  return yaml.safeLoad(config.default);
}

export async function getPostBySlug(slug) {
  const fileContent = await import(`../_posts/${slug}.md`);
  const meta = matter(fileContent.default);
  const content = marked(meta.content, {
    highlight: (code) => require("highlight.js").highlightAuto(code).value,
  });

  return {
    title: meta.data.title,
    meta: meta.data,
    content: content,
  };
}
