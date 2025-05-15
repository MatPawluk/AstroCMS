import type { APIRoute } from 'astro';
import { usePostsStore } from '../../../lib/firebase';

export const get: APIRoute = async ({ params }) => {
	try {
		const id = params.id as string;
		const postsStore = usePostsStore();
		const post = await postsStore.getPostById(id);

		if (!post) {
			return new Response(JSON.stringify({ error: 'Post not found' }), {
				status: 404,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

		return new Response(JSON.stringify(post), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
};

export const put: APIRoute = async ({ request, params }) => {
	try {
		const id = params.id as string;
		const postsStore = usePostsStore();
		const postData = await request.json();

		const updatedPost = await postsStore.updatePost(id, postData);

		return new Response(JSON.stringify(updatedPost), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to update post' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
};

export const del: APIRoute = async ({ params }) => {
	try {
		const id = params.id as string;
		const postsStore = usePostsStore();

		await postsStore.deletePost(id);

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to delete post' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
};
