import { Post, GlobalData, Author } from './types';

// Usando a variável de ambiente para o endpoint da API do CMS
const CMS_ENDPOINT = process.env.CMS_ENDPOINT || 'http://host.docker.internal:8000/wp-json/wp/v2/';


// Função para buscar dados da API do WordPress
async function fetchWordPressData(endpoint: string) {
  const response = await fetch(`${CMS_ENDPOINT}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${CMS_ENDPOINT}${endpoint}`);
  }
  return await response.json();
}

// Obtém dados globais (exemplo simplificado, já que WordPress não possui endpoint direto para isso)
export async function getGlobalData(): Promise<GlobalData> {
  // Simulando a estrutura de dados globais, pois o WordPress não tem um endpoint específico para isso
  return Promise.resolve({
    metadata: {
      site_title: 'Meu Site WordPress',
      site_tag: 'Bem-vindo ao meu site WordPress',
    },
  });
}

// Obtém todos os posts
export async function getAllPosts(): Promise<Post[]> {
  try {
    const data: any = await fetchWordPressData('posts');
    const posts: Post[] = data.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title.rendered,
      metadata: {
        published_date: post.date,
        content: post.content.rendered,
        teaser: post.excerpt.rendered,
        categories: post.categories.map((categoryId: number) => ({
          title: `Category ${categoryId}`, // Placeholder, já que o WordPress não retorna o nome da categoria diretamente com o post
        })),
        hero: post.featured_media ? { imgix_url: post.featured_media.source_url } : undefined,
        author: post._embedded?.author
          ? {
              id: post._embedded.author[0].id,
              slug: post._embedded.author[0].slug,
              title: post._embedded.author[0].name,
              metadata: {
                image: post._embedded.author[0].avatar_urls
                  ? { imgix_url: post._embedded.author[0].avatar_urls['96'] }
                  : undefined,
              },
            }
          : undefined,
      },
    }));
    return Promise.resolve(posts);
  } catch (error) {
    console.log('Erro ao buscar todos os posts vv:', error, CMS_ENDPOINT);
  }
  return Promise.resolve([]);
}

// Obtém um post específico
export async function getPost(slug: string): Promise<Post> {
  try {
    const data: any = await fetchWordPressData(`posts?slug=${slug}&_embed`);
    const post = data[0]; // O WordPress retorna um array, então pegue o primeiro item
    return {
      id: post.id,
      slug: post.slug,
      title: post.title.rendered,
      metadata: {
        published_date: post.date,
        content: post.content.rendered,
        teaser: post.excerpt.rendered,
        categories: post.categories.map((categoryId: number) => ({
          title: `Category ${categoryId}`, // Placeholder
        })),
        hero: post.featured_media ? { imgix_url: post.featured_media.source_url } : undefined,
        author: post._embedded?.author
          ? {
              id: post._embedded.author[0].id,
              slug: post._embedded.author[0].slug,
              title: post._embedded.author[0].name,
              metadata: {
                image: post._embedded.author[0].avatar_urls
                  ? { imgix_url: post._embedded.author[0].avatar_urls['96'] }
                  : undefined,
              },
            }
          : undefined,
      },
    };
  } catch (error) {
    console.log('Erro ao buscar o post:', error);
  }
  return Promise.resolve({} as Post);
}

// Obtém posts relacionados (WordPress não tem conceito direto, aqui filtramos por exclusão do slug)
export async function getRelatedPosts(slug: string): Promise<Post[]> {
  try {
    const data: any = await fetchWordPressData('posts?_embed');
    const relatedPosts: Post[] = data
      .filter((post: any) => post.slug !== slug) // Exclui o post com o slug atual
      .map((post: any) => ({
        id: post.id,
        slug: post.slug,
        title: post.title.rendered,
        metadata: {
          published_date: post.date,
          content: post.content.rendered,
          teaser: post.excerpt.rendered,
          categories: post.categories.map((categoryId: number) => ({
            title: `Category ${categoryId}`, // Placeholder
          })),
          hero: post.featured_media ? { imgix_url: post.featured_media.source_url } : undefined,
          author: post._embedded?.author
            ? {
                id: post._embedded.author[0].id,
                slug: post._embedded.author[0].slug,
                title: post._embedded.author[0].name,
                metadata: {
                  image: post._embedded.author[0].avatar_urls
                    ? { imgix_url: post._embedded.author[0].avatar_urls['96'] }
                    : undefined,
                },
              }
            : undefined,
        },
      }));
    return Promise.resolve(relatedPosts);
  } catch (error) {
    console.log('Erro ao buscar posts relacionados:', error);
  }
  return Promise.resolve([]);
}

// Obtém autor
export async function getAuthor(slug: string): Promise<Author> {
  try {
    const data: any = await fetchWordPressData(`users?slug=${slug}`);
    const author = data[0]; // WordPress retorna um array de usuários
    return {
      id: author.id,
      slug: author.slug,
      title: author.name,
      metadata: {
        image: author.avatar_urls ? { imgix_url: author.avatar_urls['96'] } : undefined,
      },
    };
  } catch (error) {
    console.log('Erro ao buscar o autor:', error);
  }
  return Promise.resolve({} as Author);
}

// Obtém posts de um autor específico
export async function getAuthorPosts(id: string): Promise<Post[]> {
  try {
    const data: any = await fetchWordPressData(`posts?author=${id}&_embed`);
    const authorPosts: Post[] = data.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title.rendered,
      metadata: {
        published_date: post.date,
        content: post.content.rendered,
        teaser: post.excerpt.rendered,
        categories: post.categories.map((categoryId: number) => ({
          title: `Category ${categoryId}`, // Placeholder
        })),
        hero: post.featured_media ? { imgix_url: post.featured_media.source_url } : undefined,
        author: post._embedded?.author
          ? {
              id: post._embedded.author[0].id,
              slug: post._embedded.author[0].slug,
              title: post._embedded.author[0].name,
              metadata: {
                image: post._embedded.author[0].avatar_urls
                  ? { imgix_url: post._embedded.author[0].avatar_urls['96'] }
                  : undefined,
              },
            }
          : undefined,
      },
    }));
    return Promise.resolve(authorPosts);
  } catch (error) {
    console.log('Erro ao buscar posts do autor:', error);
  }
  return Promise.resolve([]);
}
