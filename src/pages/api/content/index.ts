import type { APIRoute } from 'astro';
import { usePostsStore } from '../../../lib/firebase';

export const get: APIRoute = async ({ request }) => {
  try {
    const postsStore = usePostsStore();
    const posts = await postsStore.getAllPosts();
    
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const post: APIRoute = async ({ request }) => {
  try {
    const postsStore = usePostsStore();
    const postData = await request.json();
    
    const newPost = await postsStore.createPost(postData);
    
    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create post' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};