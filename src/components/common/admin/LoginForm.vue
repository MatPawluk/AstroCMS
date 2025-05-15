<template>
	<div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-md">
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Zaloguj się do panelu administracyjnego</h2>
		</div>

		<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
			<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
				<Alert v-if="error" type="error" class="mb-4" :dismissible="true" @dismiss="error = ''">
					{{ error }}
				</Alert>

				<form class="space-y-6" @submit.prevent="handleLogin">
					<div>
						<Input
							id="email"
							v-model="form.email"
							label="Adres e-mail"
							type="email"
							placeholder="nazwa@example.com"
							:required="true"
							:error="validation.email"
							@blur="validateEmail" />
					</div>

					<div>
						<Input
							id="password"
							v-model="form.password"
							label="Hasło"
							type="password"
							:required="true"
							:error="validation.password"
							@blur="validatePassword" />
					</div>

					<div>
						<Button type="submit" variant="primary" :disabled="isLoading" :full-width="true">
							<svg
								v-if="isLoading"
								class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							{{ isLoading ? 'Logowanie...' : 'Zaloguj się' }}
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuth } from '../../../lib/firebase';
import Button from '../../ui/Button.vue';
import Input from '../../ui/Input.vue';
import Alert from '../../ui/Alert.vue';

const auth = useAuth();
const isLoading = ref(false);
const error = ref('');

const form = reactive({
	email: '',
	password: '',
});

const validation = reactive({
	email: '',
	password: '',
});

// Walidacja e-maila
const validateEmail = () => {
	if (!form.email) {
		validation.email = 'E-mail jest wymagany';
		return false;
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(form.email)) {
		validation.email = 'Wprowadź poprawny adres e-mail';
		return false;
	}

	validation.email = '';
	return true;
};

// Walidacja hasła
const validatePassword = () => {
	if (!form.password) {
		validation.password = 'Hasło jest wymagane';
		return false;
	}

	if (form.password.length < 6) {
		validation.password = 'Hasło musi mieć co najmniej 6 znaków';
		return false;
	}

	validation.password = '';
	return true;
};

// Walidacja formularza
const validateForm = () => {
	const isEmailValid = validateEmail();
	const isPasswordValid = validatePassword();

	return isEmailValid && isPasswordValid;
};

// Obsługa logowania
const handleLogin = async () => {
	if (!validateForm()) return;

	isLoading.value = true;
	error.value = '';

	try {
		const { user, error: authError } = await auth.login(form.email, form.password);

		if (authError) {
			error.value = 'Nieprawidłowe dane logowania. Spróbuj ponownie.';
			return;
		}

		// Przekierowanie do panelu administracyjnego po zalogowaniu
		window.location.href = '/admin';
	} catch (err) {
		console.error('Error during login:', err);
		error.value = 'Wystąpił błąd podczas logowania. Spróbuj ponownie.';
	} finally {
		isLoading.value = false;
	}
};
</script>
