<template>
	<div>
		<header class="bg-white shadow">
			<div class="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
				<h1 class="text-xl font-bold text-gray-900">Panel administracyjny</h1>
				<Button variant="secondary" size="sm" @click="handleLogout">Wyloguj</Button>
			</div>
		</header>

		<main class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<Alert v-if="logoutError" type="error" class="mb-4" :dismissible="true" @dismiss="logoutError = ''">
				{{ logoutError }}
			</Alert>

			<ContentList
				v-if="!selectedPostId && !isCreating"
				:refresh-trigger="refreshTrigger"
				@create="startCreating"
				@edit="editPost"
				@view="viewPost"
				@deleted="handlePostDeleted" />

			<ContentForm v-else :post-id="selectedPostId" @cancel="cancelEditing" @saved="handlePostSaved" />
		</main>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../../../lib/firebase';
import Button from '../../ui/Button.vue';
import Alert from '../../ui/Alert.vue';
import ContentList from './ContentList.vue';
import ContentForm from './ContentForm.vue';

// Stan
const auth = useAuth();
const selectedPostId = ref('');
const isCreating = ref(false);
const logoutError = ref('');
const refreshTrigger = ref(0);

// Metody
const startCreating = () => {
	selectedPostId.value = '';
	isCreating.value = true;
};

const editPost = (id: string) => {
	selectedPostId.value = id;
	isCreating.value = false;
};

const viewPost = (id: string) => {
	// Przekierowanie do podglądu postu na stronie publicznej
	window.open(`/posts/${id}`, '_blank');
};

const cancelEditing = () => {
	selectedPostId.value = '';
	isCreating.value = false;
};

const handlePostSaved = () => {
	selectedPostId.value = '';
	isCreating.value = false;
	refreshTrigger.value++;
};

const handlePostDeleted = () => {
	refreshTrigger.value++;
};

const handleLogout = async () => {
	try {
		const { success, error } = await auth.logout();

		if (error) {
			logoutError.value = 'Nie udało się wylogować. Spróbuj ponownie.';
			return;
		}

		// Przekierowanie do strony logowania po wylogowaniu
		window.location.href = '/admin/login';
	} catch (err) {
		console.error('Error during logout:', err);
		logoutError.value = 'Wystąpił błąd podczas wylogowywania. Spróbuj ponownie.';
	}
};
</script>
