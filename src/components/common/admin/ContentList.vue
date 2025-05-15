<template>
	<div>
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-semibold text-gray-900">Zarządzanie treścią</h2>
			<Button @click="$emit('create')">Dodaj nowy wpis</Button>
		</div>

		<Alert v-if="error" type="error" class="mb-4" :dismissible="true" @dismiss="error = ''">
			{{ error }}
		</Alert>

		<div v-if="isLoading" class="flex justify-center my-8">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
		</div>

		<div v-else-if="posts.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">Brak treści</h3>
			<p class="mt-1 text-sm text-gray-500">Zacznij od utworzenia nowego wpisu.</p>
			<div class="mt-6">
				<Button @click="$emit('create')">Dodaj nowy wpis</Button>
			</div>
		</div>

		<div v-else class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Tytuł
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Slug
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Data publikacji
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Akcje
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-gray-900">{{ post.title }}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-500">{{ post.slug }}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span
								:class="[
									'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
									post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
								]">
								{{ post.isPublished ? 'Opublikowany' : 'Szkic' }}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{{ post.publishedAt ? formatDate(post.publishedAt) : '—' }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
							<div class="flex space-x-2">
								<Button variant="secondary" size="sm" @click="$emit('edit', post.id)"> Edytuj </Button>
								<Button variant="ghost" size="sm" @click="$emit('view', post.id)"> Podgląd </Button>
								<Button variant="danger" size="sm" @click="confirmDelete(post)"> Usuń </Button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Modal potwierdzenia usunięcia -->
		<div
			v-if="showDeleteModal"
			class="fixed inset-0 z-10 overflow-y-auto"
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="true">
			<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showDeleteModal = false"></div>

				<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

				<div
					class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
					<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div
								class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
								<svg
									class="h-6 w-6 text-red-600"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
							<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Potwierdź usunięcie</h3>
								<div class="mt-2">
									<p class="text-sm text-gray-500">
										Czy na pewno chcesz usunąć "{{ postToDelete?.title }}"? Ta akcja jest nieodwracalna.
									</p>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
						<Button variant="danger" @click="handleDelete" :disabled="isDeleting" class="w-full sm:w-auto sm:ml-3">
							{{ isDeleting ? 'Usuwanie...' : 'Usuń' }}
						</Button>
						<Button variant="secondary" @click="showDeleteModal = false" class="mt-3 w-full sm:mt-0 sm:w-auto">
							Anuluj
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { usePostsStore, type Post } from '../../../lib/firebase';
import Button from '../../ui/Button.vue';
import Alert from '../../ui/Alert.vue';

// Props i emity
defineProps({
	refreshTrigger: {
		type: Number,
		default: 0,
	},
});

const emit = defineEmits(['create', 'edit', 'view', 'deleted']);

// Stan
const posts = ref<Post[]>([]);
const isLoading = ref(true);
const error = ref('');
const showDeleteModal = ref(false);
const postToDelete = ref<Post | null>(null);
const isDeleting = ref(false);

// Pobieranie postów
const fetchPosts = async () => {
	isLoading.value = true;
	error.value = '';

	try {
		const postsStore = usePostsStore();
		posts.value = await postsStore.getAllPosts();
	} catch (err) {
		console.error('Error fetching posts:', err);
		error.value = 'Nie udało się pobrać listy wpisów. Spróbuj ponownie.';
	} finally {
		isLoading.value = false;
	}
};

// Formatowanie daty
const formatDate = (timestamp: any) => {
	if (!timestamp) return '—';

	const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
	return new Intl.DateTimeFormat('pl-PL', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
};

// Potwierdzenie usunięcia
const confirmDelete = (post: Post) => {
	postToDelete.value = post;
	showDeleteModal.value = true;
};

// Usuwanie postu
const handleDelete = async () => {
	if (!postToDelete.value?.id) return;

	isDeleting.value = true;

	try {
		const postsStore = usePostsStore();
		await postsStore.deletePost(postToDelete.value.id);

		// Usuń post z lokalnej tablicy
		posts.value = posts.value.filter(p => p.id !== postToDelete.value?.id);

		showDeleteModal.value = false;
		emit('deleted', postToDelete.value.id);
	} catch (err) {
		console.error('Error deleting post:', err);
		error.value = 'Nie udało się usunąć wpisu. Spróbuj ponownie.';
	} finally {
		isDeleting.value = false;
		postToDelete.value = null;
	}
};

// Inicjalizacja
onMounted(fetchPosts);

// Obserwowanie zmian w refreshTrigger, aby odświeżyć listę po dodaniu/edycji postu
watch(
	() => props.refreshTrigger,
	() => {
		fetchPosts();
	}
);
</script>
