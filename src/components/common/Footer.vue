<template>
    <footer class="bg-gray-50 mt-auto">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="border-t border-gray-200 pt-8">
          <p class="text-base text-gray-400 text-center">
            &copy; {{ currentYear }} Astro CMS by <a href="https://github.com/MatPawluk">Mateusz Pawluk</a>. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const currentYear = computed(() => new Date().getFullYear());
  </script>