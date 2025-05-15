import type { Post } from './firebase';

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000/api' : '/api';

export const apiClient = {
	// Endpointy dla treści
	posts: {
		getAll: async (): Promise<Post[]> => {
			const response = await fetch(`${API_BASE_URL}/content`);
			if (!response.ok) throw new Error('Failed to fetch posts');
			return response.json();
		},

		getById: async (id: string): Promise<Post> => {
			const response = await fetch(`${API_BASE_URL}/content/${id}`);
			if (!response.ok) throw new Error('Failed to fetch post');
			return response.json();
		},

		create: async (postData: Omit<Post, 'id'>): Promise<Post> => {
			const response = await fetch(`${API_BASE_URL}/content`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(postData),
			});

			if (!response.ok) throw new Error('Failed to create post');
			return response.json();
		},

		update: async (id: string, postData: Partial<Post>): Promise<Post> => {
			const response = await fetch(`${API_BASE_URL}/content/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(postData),
			});

			if (!response.ok) throw new Error('Failed to update post');
			return response.json();
		},

		delete: async (id: string): Promise<void> => {
			const response = await fetch(`${API_BASE_URL}/content/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete post');
		},
	},

	// Endpointy dla autentykacji
	auth: {
		login: async (email: string, password: string) => {
			const response = await fetch(`${API_BASE_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) throw new Error('Authentication failed');
			return response.json();
		},

		logout: async () => {
			const response = await fetch(`${API_BASE_URL}/auth/logout`, {
				method: 'POST',
			});

			if (!response.ok) throw new Error('Logout failed');
			return response.json();
		},
	},
};
