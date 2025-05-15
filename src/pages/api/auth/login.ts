import type { APIRoute } from 'astro';
import { useAuth } from '../../../lib/firebase';

export const post: APIRoute = async ({ request }) => {
	try {
		const { email, password } = await request.json();
		const auth = useAuth();

		const { user, error } = await auth.login(email, password);

		if (error) {
			return new Response(JSON.stringify({ error: 'Authentication failed' }), {
				status: 401,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

		return new Response(JSON.stringify({ user: { uid: user?.uid, email: user?.email } }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Authentication failed' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
};
