import matter from 'gray-matter'
import marked from 'marked'
import yaml from 'js-yaml'

export async function getAllPosts() {
  const context = require.context('../_posts', false, /\.md$/)
  const posts = []
  for(const key of context.keys()){
    const post = key.slice(2);
    const content = await import(`../_posts/${post}`);
    const meta = matter(content.default)
    posts.push({
      title: meta.data.title,
      slug: post.replace('.md', ''),
    })
  }
  return posts;
}

export async function getConfig() {
  const config = await import(`../config.yml`)
  return yaml.safeLoad(config.default)
} 
export async function getPostBySlug(slug) {
  const fileContent = await import(`../_posts/${slug}.md`)
  const meta = matter(fileContent.default)
  const content = marked(meta.content)     
  return {
    title: meta.data.title, 
    content: content
  }
}