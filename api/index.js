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
    
    let parts = post.replace('.md', '').split('-');
    parts.push(parts.shift());
  
    posts.push({
      title: meta.data.title,
      slug: parts.join('-'),
    })
  }
  return posts;
}

export async function getConfig() {
  const config = await import(`../config.yml`)
  return yaml.safeLoad(config.default)
} 
export async function getPostBySlug(slug) {
  let parts = post.split('-');
  parts.unshift(parts.pop());
  
//  const file = parts.join('-') + '.md';
  const file = '1-remaking-my-website-again.md';
  const fileContent = await import(`../_posts/${file}`)
  const meta = matter(fileContent.default)
  const content = marked(meta.content)   
   
  return {
    title: meta.data.title, 
    content: content
  }
}