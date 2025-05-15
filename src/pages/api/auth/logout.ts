import type { APIRoute } from 'astro';
import { useAuth } from '../../../lib/firebase';

export const post: APIRoute = async ({ request }) => {
	try {
		const auth = useAuth();
		const { success, error } = await auth.logout();

		if (error) {
			return new Response(JSON.stringify({ error: 'Logout failed' }), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

		return new Response(JSON.stringify({ success }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Logout failed' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
};
