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

				<div v-if="isLoading" class="mb-4 p-4 text-center">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p class="mt-2">Logowanie...</p>
				</div>

				<form v-else class="space-y-6" @submit.prevent="handleLogin">
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
							class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
							Zaloguj się
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, reactive, onBeforeMount } from 'vue';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Inicjalizacja Firebase
const firebaseConfig = {
	apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
	authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default {
	setup() {
		const isLoading = ref(true);
		const error = ref('');

		const form = reactive({
			email: '',
			password: '',
		});

		// Sprawdź stan uwierzytelnienia bezpośrednio w komponencie
		onBeforeMount(() => {
			onAuthStateChanged(auth, user => {
				isLoading.value = false;

				if (user) {
					console.log('Użytkownik zalogowany:', user.email);
					// Przekieruj do dashboardu
					window.location.href = '/admin';
				}
			});
		});

		const handleLogin = async () => {
			if (!form.email || !form.password) return;

			isLoading.value = true;
			error.value = '';

			try {
				// Logowanie bezpośrednio przez Firebase
				await signInWithEmailAndPassword(auth, form.email, form.password);

				// Przekierowanie następuje automatycznie w onAuthStateChanged
			} catch (err) {
				console.error('Błąd logowania:', err.message);
				error.value = 'Nieprawidłowe dane logowania. Spróbuj ponownie.';
				isLoading.value = false;
			}
		};

		return {
			isLoading,
			error,
			form,
			handleLogin,
		};
	},
};
</script>
