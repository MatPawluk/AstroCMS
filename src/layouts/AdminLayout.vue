<template>
	<div class="min-h-screen flex flex-col bg-gray-100">
		<div v-if="showSidebar" class="flex flex-1">
			<!-- Sidebar dla zalogowanych użytkowników -->
			<Sidebar v-if="isAuthenticated" />

			<!-- Główna zawartość -->
			<div class="flex-1">
				<slot />
			</div>
		</div>
		<div v-else class="flex-1">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuth } from '../lib/firebase';
import Sidebar from '../components/common/Sidebar.vue';

const auth = useAuth();
const currentPath = ref('');

// Sprawdź, czy użytkownik jest zalogowany
const isAuthenticated = computed(() => {
	return !!auth.currentUser.value;
});

// Sprawdź, czy aktualnie jesteśmy na stronie logowania
const isLoginPage = computed(() => {
	return currentPath.value === '/admin/login';
});

// Pokaż sidebar tylko na stronach admina, ale nie na stronie logowania
const showSidebar = computed(() => {
	return currentPath.value.startsWith('/admin') && !isLoginPage.value;
});

onMounted(() => {
	currentPath.value = window.location.pathname;

	// Jeśli użytkownik próbuje dostać się do panelu admin bez zalogowania, przekieruj na stronę logowania
	if (!isAuthenticated.value && !isLoginPage.value && currentPath.value.startsWith('/admin')) {
		window.location.href = '/admin/login';
	}
});
</script>
