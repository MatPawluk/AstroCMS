<template>
	<div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-md">
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Zaloguj się do panelu</h2>
		</div>

		<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
			<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
				<div v-if="error" class="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
					{{ error }}
				</div>

				<form class="space-y-6" @submit.prevent="handleLogin">
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700"> Adres email </label>
						<div class="mt-1">
							<input
								id="email"
								v-model="form.email"
								type="email"
								autocomplete="email"
								required
								class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
						</div>
					</div>

					<div>
						<label for="password" class="block text-sm font-medium text-gray-700"> Hasło </label>
						<div class="mt-1">
							<input
								id="password"
								v-model="form.password"
								type="password"
								autocomplete="current-password"
								required
								class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
						</div>
					</div>

					<div>
						<button
							type="submit"
							class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							:disabled="isLoading">
							<span v-if="isLoading">Logowanie...</span>
							<span v-else>Zaloguj się</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuth } from '../../../lib/firebase';

const auth = useAuth();
const isLoading = ref(false);
const error = ref('');
const isAuthenticated = ref(false);

const form = reactive({
	email: '',
	password: '',
});

// Sprawdź stan uwierzytelnienia po załadowaniu komponentu
onMounted(() => {
	// Ustawić timeout, aby dać Firebase czas na inicjalizację
	setTimeout(() => {
		if (auth.currentUser.value) {
			console.log('Użytkownik jest już zalogowany:', auth.currentUser.value.email);
			window.location.href = '/admin';
		}
	}, 1000);
});

const handleLogin = async () => {
	if (!form.email || !form.password) return;

	isLoading.value = true;
	error.value = '';

	try {
		console.log('Próba logowania:', form.email);
		const { user, error: authError } = await auth.login(form.email, form.password);

		if (authError) {
			console.error('Błąd logowania:', authError);
			error.value = 'Nieprawidłowe dane logowania. Spróbuj ponownie.';
			isLoading.value = false;
			return;
		}

		console.log('Logowanie udane:', user);
		isAuthenticated.value = true;

		// Ustawić timeout przed przekierowaniem, aby upewnić się, że stan uwierzytelnienia jest zaktualizowany
		setTimeout(() => {
			console.log('Przekierowanie do panelu administratora');
			window.location.href = '/admin';
		}, 1000);
	} catch (err) {
		console.error('Błąd podczas logowania:', err);
		error.value = 'Wystąpił błąd podczas logowania. Spróbuj ponownie.';
		isLoading.value = false;
	}
};
</script>
