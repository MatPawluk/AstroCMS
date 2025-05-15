<template>
	<header class="bg-white shadow-sm">
		<nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex">
					<div class="flex flex-shrink-0 items-center">
						<a href="/" class="text-primary-600 font-bold text-xl">Astro CMS</a>
					</div>
					<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
						<a
							href="/"
							:class="[
								'inline-flex items-center px-1 pt-1 text-sm font-medium',
								currentPath === '/'
									? 'border-b-2 border-primary-500 text-gray-900'
									: 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
							]">
							Strona główna
						</a>
						<a
							href="/posts"
							:class="[
								'inline-flex items-center px-1 pt-1 text-sm font-medium',
								currentPath.startsWith('/posts')
									? 'border-b-2 border-primary-500 text-gray-900'
									: 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
							]">
							Blog
						</a>
					</div>
				</div>
				<div class="hidden sm:ml-6 sm:flex sm:items-center">
					<a
						href="/admin"
						class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
						Panel administratora
					</a>
				</div>

				<!-- Menu mobilne -->
				<div class="flex items-center sm:hidden">
					<button
						type="button"
						class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
						@click="mobileMenuOpen = !mobileMenuOpen">
						<span class="sr-only">Otwórz menu główne</span>
						<svg
							v-if="!mobileMenuOpen"
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
						<svg
							v-else
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>
		</nav>

		<!-- Menu mobilne -->
		<div v-if="mobileMenuOpen" class="sm:hidden">
			<div class="space-y-1 pt-2 pb-3">
				<a
					href="/"
					:class="[
						'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
						currentPath === '/'
							? 'border-primary-500 bg-primary-50 text-primary-700'
							: 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700',
					]">
					Strona główna
				</a>
				<a
					href="/posts"
					:class="[
						'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
						currentPath.startsWith('/posts')
							? 'border-primary-500 bg-primary-50 text-primary-700'
							: 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700',
					]">
					Blog
				</a>
				<a
					href="/admin"
					class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
					Panel administratora
				</a>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Stan
const mobileMenuOpen = ref(false);
const currentPath = ref('/');

// Pobierz aktualną ścieżkę
onMounted(() => {
	currentPath.value = window.location.pathname;
});
</script>
